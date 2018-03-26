import {
    Query, GraphQLNonNull, Type,
    GapiController, GraphQLInt, Injector, GraphQLString
} from '@gapi/core';
import { UserService } from './services/user.service';
import { UserType } from './types/user.type';
import { User } from '../../models/User';
import { UserTokenType } from './types/user-login.type';
import { AuthPrivateService } from '../core/services/auth/auth.service';

@GapiController()
export class UserQueriesController {

    constructor(
        private userService: UserService,
        private authService: AuthPrivateService
    ) {}

    @Type(UserType)
    @Query({
        id: {
            type: new GraphQLNonNull(GraphQLInt)
        }
    })
    findUser(root, { id }, context): PromiseLike<User>  {
        return this.userService.findUser(id);
    }

    @Type(UserTokenType)
    @Query({
        email: {
            type: new GraphQLNonNull(GraphQLString)
        },
        password: {
            type: new GraphQLNonNull(GraphQLString)
        }
    })
    login(root, { email, password }, context) {
        let credential: any;

        // Find user from database
        const user = <any>{
            id: 1,
            username: email,
            type: 'ADMIN',
            settings: {
                sidebar: true,
                language: 'FR'
            },
            password: this.authService.encryptPassword(password),
            name: 'Test Testov'
        };

        if (this.authService.decryptPassword(user.password) === password) {
            credential = {
                user: user,
                token: this.authService.signJWTtoken({
                    email: user.email,
                    id: user.id,
                    scope: [user.type]
                })
            };
        } else {
            throw new Error('missing-username-or-password');
        }
        return credential;
    }


}




