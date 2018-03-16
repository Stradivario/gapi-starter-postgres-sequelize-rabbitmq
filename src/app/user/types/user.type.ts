import { GraphQLString, GraphQLInt, GapiObjectType, GraphQLScalarType } from '@gapi/core';
import { UserSettings, UserSettingsObjectType } from './user.settings';

@GapiObjectType()
export class UserType {
    readonly id: number | GraphQLScalarType = GraphQLInt;
    readonly username: string | GraphQLScalarType = GraphQLString;
    readonly userType: string | GraphQLScalarType = GraphQLString;
    readonly settings: UserSettings = UserSettingsObjectType;
}

export const UserObjectType = new UserType();