import { GapiObjectType, GraphQLScalarType, GraphQLString } from '@gapi/core';

@GapiObjectType()
export class UserMessage {
    readonly message: number | GraphQLScalarType = GraphQLString;
}