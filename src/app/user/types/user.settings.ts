import { GraphQLString, GapiObjectType, GraphQLScalarType, GraphQLBoolean } from '@gapi/core';


@GapiObjectType()
export class UserSettings {
    readonly sidebar: string | GraphQLScalarType = GraphQLBoolean;
    readonly language: string | GraphQLScalarType = GraphQLString;
}

export const UserSettingsObjectType = new UserSettings();