import { GapiObjectType, GraphQLScalarType, GraphQLString } from 'gapi';

@GapiObjectType()
export class UserMessage {
    readonly message: number | GraphQLScalarType = GraphQLString;
}

export const UserMessageType = new UserMessage();