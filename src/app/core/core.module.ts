
import { GapiModule, ConfigService } from 'gapi';
import { SequelizeModule } from 'gapi-sequelize';
import { AuthPrivateService } from './services/auth/auth.service';
import { readFileSync } from 'fs';

@GapiModule({
    services: [
        SequelizeModule.forRoot({
            dialect: 'postgres',
            host: process.env.DB_HOST || '182.10.0.4',
            port: process.env.DB_PORT || '5432',
            username: process.env.DB_USERNAME || 'dbuser',
            password: process.env.DB_PASSWORD || 'dbuserpass',
            name: process.env.DB_NAME || 'postgres',
            storage: ':memory:',
            logging: true,
            force: true,
            modelPaths: [process.cwd() + '/src/models']
          }
        ),
        ConfigService.forRoot({
            AMQP_CONFIG: {
                host: '182.10.0.5',
                port: 5672
            },
            APP_CONFIG: {
                port: process.env.API_PORT || 9200,
                cert: readFileSync('./cert.key'),
                graphiql: true,
                graphiqlToken: process.env.GRAPHIQL_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImtyaXN0aXFuLnRhY2hldkBnbWFpbC5jb20iLCJpZCI6MSwic2NvcGUiOlsiQURNSU4iXSwiaWF0IjoxNTIwMjkxMzkyfQ.9hpIDPkSiGvjTmUEyg_R_izW-ra2RzzLbe3Uh3IFsZg'
            },
        }),
        AuthPrivateService
    ]
})
export class CoreModule {}