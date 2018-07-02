import { Service, Injector, Container } from '@gapi/core';
import { Observable, from } from 'rxjs';
import { tester } from 'graphql-tester';
import { User } from '../../../models/User';
import { Credential } from '../../../models/Credential';
import { generateEmail, generateName } from './randomNameGenerator';
import { AuthService } from '../services/auth/auth.service';
import { Sequelize } from 'sequelize-typescript';
import { SequelizeConfig } from '@gapi/sequelize';
import { AuthTestingModule } from '../services/auth/auth.service.unit.module';

interface Response<T> {
    raw: string;
    data: T;
    errors: Array<{ message: string, name: string; time_thrown: string, data: {} }>;
    headers: {};
    status: number;
    success: boolean;
}

export interface SIGNITURE {
    user: User;
    credential: Credential;
    token: string;
}

interface TESTERS {
    ADMIN?: SIGNITURE;
    USER?: SIGNITURE;
    ME?: SIGNITURE;
}

interface SendRequestQueryType {
    query: string;
    variables?: any;
    signiture?: SIGNITURE;
}

Container.get(AuthTestingModule);

@Service()
export class TestUtilService {
    users: TESTERS = {};
    defaultPassword = '123456';
    private tester: any;
    public sequelize: Sequelize;
    private ME_TESTING_DATABASE_ID = 1;
    private ADMIN_TESTING_DATABASE_ID = 2;
    private USER_TESTING_DATABASE_ID = 3;
    private defaultSequelizeConfig: SequelizeConfig = {
        dialect: 'postgres',
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        name: process.env.DB_NAME,
        storage: ':memory:',
        logging: false,
        force: false,
        modelPaths: [process.cwd() + '/src/models']
    };
    public sequelizeConfig: SequelizeConfig = this.defaultSequelizeConfig;

    @Injector(AuthService) private authService: AuthService;

    currentTestSignitures: Array<SIGNITURE> = [];
    // tslint:disable-next-line:max-line-length
    // private token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImtyaXN0aXFuLnRhY2hldkBnbWFpbC5jb20iLCJzY29wZSI6WyJBRE1JTiJdLCJpZCI6MSwiaWF0IjoxNTE2OTk2MzYxfQ.7ANr5VHrViD3NkCaDr0nSWYwk46UAEbOwB52pqye4AM';

    constructor(

    ) {
        this.enableAuthorization();
    }

    initSequelize() {
        this.sequelize = new Sequelize(<any>this.sequelizeConfig);
        this.sequelize.sync({ force: this.sequelizeConfig.force, logging: this.sequelizeConfig.logging });
    }

    setSequelizeConfig(config?: SequelizeConfig) {
        this.sequelizeConfig = config ? Object.assign(this.defaultSequelizeConfig, config) : this.defaultSequelizeConfig;
    }

    disableAuthorization() {
        this.tester = tester({ url: process.env.ENDPOINT_TESTING, contentType: 'application/json' });
    }

    enableAuthorization() {
        this.tester = tester({ url: process.env.ENDPOINT_TESTING, contentType: 'application/json', authorization: process.env.TOKEN_TESTING });
    }

    sendRequest<T>(query: SendRequestQueryType): Observable<Response<T>> {
        if (query.signiture) {
            this.tester = tester({
                url: process.env.ENDPOINT_TESTING,
                contentType: 'application/json',
                authorization: query.signiture.token
            });
        }
        return from(this.tester(JSON.stringify(query)));
    }

    init() {
        this.initSequelize();
        return this.sequelize.sync().then(async () => await this.initTestUsers());
    }

    async destroy() {
        await this.softDeleteTestSignitures();
        this.sequelize.close();
    }

    async destroySigniture(signiture: SIGNITURE) {
        if (signiture.credential) {
            await Credential.destroy({ where: { userId: signiture.user.id } });
        }

        if (signiture.user) {
            await User.destroy({ where: { id: signiture.user.id } });
        }

        return Promise.resolve(true);
    }

    async softDeleteTestSignitures() {
        return await Promise.all(this.currentTestSignitures.map(async signiture => await this.destroySigniture(signiture)));
    }

    async initTestUsers() {
        const ADMIN_CREDENTIAL: Credential = await Credential.find(<any>{
            where: {
                userId: this.ADMIN_TESTING_DATABASE_ID
            },
            include: [{
                association: 'user'
            }]
        });

        const USER_CREDENTIAL: Credential = await Credential.find(<any>{
            where: {
                userId: this.USER_TESTING_DATABASE_ID
            },
            include: [{
                association: 'user'
            }]
        });

        const ME_CREDENTIAL: Credential = await Credential.find(<any>{
            where: {
                userId: this.ME_TESTING_DATABASE_ID
            },
            include: [{
                association: 'user'
            }]
        });
        this.users.ADMIN = {
            credential: ADMIN_CREDENTIAL,
            user: ADMIN_CREDENTIAL.user,
            token: this.authService.signJWTtoken({
                email: ADMIN_CREDENTIAL.email,
                scope: [ADMIN_CREDENTIAL.user.type],
                id: ADMIN_CREDENTIAL.id
            })
        };

        this.users.USER = {
            credential: USER_CREDENTIAL,
            user: USER_CREDENTIAL.user,
            token: this.authService.signJWTtoken({
                email: USER_CREDENTIAL.email,
                scope: [USER_CREDENTIAL.user.type],
                id: USER_CREDENTIAL.id
            })
        };

        this.users.ME = {
            credential: ME_CREDENTIAL,
            user: ME_CREDENTIAL.user,
            token: this.authService.signJWTtoken({
                email: ME_CREDENTIAL.email,
                scope: [ME_CREDENTIAL.user.type],
                id: ME_CREDENTIAL.id
            })
        };

        return Promise.resolve(this.users);
    }

    async createSigniture(type: 'USER' | 'ADMIN' | 'SALES' = 'USER', settings: { wallet?: boolean }): Promise<SIGNITURE> {
        const user = await User.create({ name: generateName(), type: type });
        const credential = await Credential.create({
            email: generateEmail(),
            password: this.authService.encryptPassword(this.defaultPassword),
            userId: user.id
        });

        const token = this.authService.signJWTtoken({
            email: credential.email,
            scope: [user.type],
            id: credential.id
        });
        const signiture = { user, credential, token: token };
        this.currentTestSignitures.push(signiture);
        return signiture;
    }

}
