import {
    GraphQLNonNull,
    Scope, Type,
    Mutation, Controller,
    GraphQLInt,
    PubSubService, GraphQLString, GraphQLID,
    GraphQLInputObjectType, GraphQLBoolean
} from '@gapi/core';
import { UserService } from './services/user.service';
import { UserType } from './types/user.type';
import { UserMessage } from './types/user-message.type';
import { UserPayloadType } from './types/user.payload.type';
import { User } from '../../models/User';

@Controller()
export class UserMutationsController {

    constructor(
        private userService: UserService,
        private pubsub: PubSubService
    ) {}

    @Scope('ADMIN')
    @Type(UserType)
    @Mutation({
        id: {
            type: new GraphQLNonNull(GraphQLInt)
        }
    })
    destroyUser(root, { id }, context): PromiseLike<number> {
        return this.userService.destroyUser(id);
    }


    @Scope('ADMIN')
    @Type(UserType)
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
    @Type(UserType)
    @Mutation({
        username: {
            type: new GraphQLNonNull(GraphQLString)
        },
        type: {
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
    @Type(UserMessage)
    @Mutation({
        message: {
            type: new GraphQLNonNull(GraphQLString)
        },
        signal: {
            type: new GraphQLNonNull(GraphQLString)
        },
    })
    publishSignal(root, { message, signal }, context): UserMessage {
        console.log(`${signal} Signal Published message: ${message} by ${context.user.email}`);
        this.pubsub.publish(signal, `${signal} Signal Published message: ${message} by ${context.user.email}`);
        return { message };
    }

}
