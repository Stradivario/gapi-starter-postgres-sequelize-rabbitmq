import { CoreModule, Module } from '@gapi/core';
import { AuthService } from './app/core/services/auth/auth.service';
import { AuthModule } from '@gapi/auth';
import { readFileSync } from 'fs';

@Module({
    imports: [
        AuthModule.forRoot({
            algorithm: 'HS256',
            cert: readFileSync('./cert.key'),
            cyper: {
                algorithm: 'aes256',
                iv: 'Jkyt1H3FA8JK9L3B',
                privateKey: '8zTVzr3p53VC12jHV54rIYu2545x47lA'
            }
        }),
        CoreModule.forRoot({
            server: {
                hapi: {
                    port: process.env.API_PORT || process.env.PORT || 9000
                }
            },
            pubsub: {
                authentication: AuthService
            },
            graphql: {
                path: '/graphql',
                openBrowser: false,
                writeEffects: false,
                graphiQlPath: '/graphiql',
                authentication: AuthService,
                graphiqlOptions: {
                    endpointURL: '/graphql',
                    passHeader: `'Authorization':'${process.env.GRAPHIQL_TOKEN}'`,
                    subscriptionsEndpoint: `${process.env.GRAPHIQL_WS_SSH ? 'wss' : 'ws'}://${process.env.GRAPHIQL_WS_PATH || 'localhost'}${process.env.DEPLOY_PLATFORM === 'heroku'
                        ? ''
                        : `:${process.env.API_PORT ||
                            process.env.PORT}`}/subscriptions`,
                    websocketConnectionParams: {
                        token: process.env.GRAPHIQL_TOKEN
                    }
                },
                graphqlOptions: {
                    schema: null
                }
            },
        }),

    ]
})
export class FrameworkImports {}
