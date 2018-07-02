
import { Service } from '@rxdi/core';
import * as Boom from 'boom';
import { AuthInterface, AuthInternalService, TokenData } from '@gapi/auth';

export interface UserInfo {
    scope: ['ADMIN', 'USER'];
    type: 'ADMIN' | 'USER';
    iat: number;
}

@Service()
export class AuthService implements AuthInterface {

    constructor(
        private authService: AuthInternalService
    ) { }

    onSubOperation(message, params, webSocket) {
        return params;
    }

    onSubConnection(connectionParams): TokenData {
        if (connectionParams.token) {
            return this.validateToken(connectionParams.token, 'Subscription');
        } else {
            throw Boom.unauthorized();
        }
    }

    validateToken(token: string, requestType: 'Query' | 'Subscription' = 'Query'): any {
        const user = <any>this.authService.verifyToken(token);
        user.type = user.scope[0];
        console.log(`${requestType} from: ${JSON.stringify(user)}`);
        if (user) {
            return user;
        } else {
            throw Boom.unauthorized();
        }
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

    verifyToken(token: string): TokenData {
        return this.authService.verifyToken(token);
    }

    decryptPassword(password: string): string {
        return this.authService.decrypt(password);
    }

    encryptPassword(password: string): string {
        return this.authService.encrypt(password);
    }

}
