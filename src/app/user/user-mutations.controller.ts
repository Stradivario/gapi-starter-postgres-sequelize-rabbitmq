import { Query, GraphQLNonNull, Scope, Type, GraphQLObjectType, Mutation, GapiController, Service, GraphQLInt, Container, Injector, GapiPubSubService, GraphQLString, GraphQLInputObjectType, GraphQLBoolean } from "gapi";
import { UserService } from './services/user.service';
import { UserObjectType, UserType } from './types/user.type';
import { UserMessage, UserMessageType } from "./types/user-message.type";
import { UserPayloadType } from './types/user.payload.type';
import { User } from "../../models/User";
import { GraphQLID } from "graphql";



@GapiController()
export class UserMutationsController {

    @Injector(UserService) private userService: UserService;
    @Injector(GapiPubSubService) private pubsub: GapiPubSubService;


    @Scope('ADMIN')
    @Type(UserObjectType)
    @Mutation({
        id: {
            type: new GraphQLNonNull(GraphQLInt)
        }
    })
    destroyUser(root, { id }, context): PromiseLike<number> {
        return this.userService.destroyUser(id);
    }


    @Scope('ADMIN')
    @Type(UserObjectType)
    @Mutation({
        id: {
            type: new GraphQLNonNull(GraphQLID)
        },
        payload: {
            type: new GraphQLNonNull(UserPayloadType)
        }
    }
    )
    updateUser(root, payload, context): PromiseLike<[number, User[]]> {
        return this.userService.updateUser(payload.id, payload);
    }


    @Scope('ADMIN')
    @Type(UserObjectType)
    @Mutation({
        username: {
            type: new GraphQLNonNull(GraphQLString)
        },
        userType: {
            type: new GraphQLNonNull(GraphQLString)
        },
        settings: {
            type: new GraphQLInputObjectType({
                name: 'AddUserInputObjectType',
                fields: {
                    sidebar: {
                        type: GraphQLBoolean
                    },
                    language: {
                        type: GraphQLString
                    }
                }
            })
        }
    })
    addUser(root, payload, context): PromiseLike<User> {
        return this.userService.createUser(payload);
    }


    @Scope('ADMIN')
    @Type(UserMessageType)
    @Mutation({
        message: {
            type: new GraphQLNonNull(GraphQLString)
        },
        signal: {
            type: new GraphQLNonNull(GraphQLString)
        },
    })
    publishSignal(root, { message, signal }, context): UserMessage {
        console.log(`${signal} Signal Published message: ${message} by ${context.email}`);
        this.pubsub.publish(signal, `${signal} Signal Published message: ${message} by ${context.email}`);
        return { message };
    }

}
