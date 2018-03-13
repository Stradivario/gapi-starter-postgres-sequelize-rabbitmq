import { GraphQLInputObjectType, GraphQLNonNull, GraphQLBoolean, GraphQLString } from 'graphql';

export const UserPayloadType = new GraphQLInputObjectType({
    name: 'UserPayloadType',
    fields: {
        username: {
            type: new GraphQLNonNull(GraphQLString)
        },
        settings: {
            type: new GraphQLInputObjectType({
                name: 'UserPayloadSettingsType',
                fields: {
                    sidebar: {
                        type: new GraphQLNonNull(GraphQLBoolean)
                    },
                    language: {
                        type: new GraphQLNonNull(GraphQLString)
                    }
                }
            })
        },
    }
});