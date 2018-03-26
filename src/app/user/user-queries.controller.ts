import {
    Query, GraphQLNonNull, Type,
    GapiController, GraphQLInt, Injector
} from '@gapi/core';
import { UserService } from './services/user.service';
import { UserType } from './types/user.type';
import { User } from '../../models/User';

@GapiController()
export class UserQueriesController {

    constructor(
        private userService: UserService
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

}




