import { GapiObjectType, GraphQLScalarType, GraphQLString, InjectType } from '@gapi/core';
import { UserType } from './user.type';

@GapiObjectType()
export class UserTokenType {
    readonly token: string | GraphQLScalarType = GraphQLString;
    readonly user: UserType = InjectType(UserType);
}