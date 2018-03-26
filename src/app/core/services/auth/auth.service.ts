
import { Service, ConnectionHookService, AuthService, Injector, TokenData } from '@gapi/core';
import * as Boom from 'boom';


interface UserInfo extends TokenData {
    scope: ['ADMIN', 'USER'];
    type: 'ADMIN' | 'USER';
}

@Service()
export class AuthPrivateService {

    constructor(
        private authService: AuthService,
        private connectionHookService: ConnectionHookService
    ) {
        this.connectionHookService.modifyHooks.onSubConnection = this.onSubConnection.bind(this);
        this.authService.modifyFunctions.validateToken = this.validateToken.bind(this);
    }

    onSubConnection(connectionParams): UserInfo {
        if (connectionParams.token) {
            return this.validateToken(connectionParams.token, 'Subscription');
        } else {
            throw Boom.unauthorized();
        }
    }

    validateToken(token: string, requestType: 'Query' | 'Subscription' = 'Query'): UserInfo {
        const user = <UserInfo>this.verifyToken(token);
        user.type = user.scope[0];
        console.log(`${requestType} from: ${JSON.stringify(user)}`);
        if (user) {
            return user;
        } else {
            throw Boom.unauthorized();
        }
    }

    verifyToken(token: string): TokenData {
        return this.authService.verifyToken(token);
    }

    signJWTtoken(tokenData: TokenData): string {
        return this.authService.sign(tokenData);
    }

    issueJWTToken(tokenData: TokenData) {
        const jwtToken = this.authService.sign({
            email: '',
            id: 1,
            scope: ['ADMIN', 'USER']
        });
        return jwtToken;
    }

    decryptPassword(password: string): string {
        return this.authService.decrypt(password);
    }

    encryptPassword(password: string): string {
        return this.authService.encrypt(password);
    }

}
