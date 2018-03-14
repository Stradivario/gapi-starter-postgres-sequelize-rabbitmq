import {
    Query, GraphQLNonNull, Scope, Type, GraphQLObjectType, Mutation,
    GapiController, Service, GraphQLInt, Container, Injector, GapiPubSubService
} from 'gapi';
import { UserService } from './services/user.service';
import { UserObjectType, UserType } from './types/user.type';
import { User } from '../../models/User';

@GapiController()
export class UserQueriesController {

    @Injector(UserService) private userService: UserService;

    @Type(UserObjectType)
    @Query({
        id: {
            type: new GraphQLNonNull(GraphQLInt)
        }
    })
    findUser(root, { id }, context): PromiseLike<User>  {
        return this.userService.findUser(id);
    }

}




