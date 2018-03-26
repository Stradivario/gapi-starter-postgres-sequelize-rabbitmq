import { GraphQLString, GraphQLInt, GapiObjectType, GraphQLScalarType, InjectType } from '@gapi/core';
import { UserSettings } from './user.settings';


@GapiObjectType()
export class UserType {
    readonly id: number | GraphQLScalarType = GraphQLInt;
    readonly username: string | GraphQLScalarType = GraphQLString;
    readonly type: string | GraphQLScalarType = GraphQLString;
    readonly settings: UserSettings = InjectType(UserSettings);
}
