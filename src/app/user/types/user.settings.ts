import { GraphQLObjectType, GraphQLString, GraphQLInt, GapiObjectType, Type, Resolve, Injector, GraphQLScalarType, GraphQLBoolean } from "gapi";
import { AnotherService } from "../services/user.service";


@GapiObjectType()
export class UserSettings {
    readonly sidebar: string | GraphQLScalarType = GraphQLBoolean;
    readonly language: string | GraphQLScalarType = GraphQLString;
}

export const UserSettingsObjectType = new UserSettings();