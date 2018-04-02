
import { GapiModule } from '@gapi/core';
import { UserQueriesController } from './user-queries.controller';
import { UserSubscriptionsController } from './user-subscriptions.controller';
import { UserMutationsController } from './user-mutations.controller';
import { UserService } from './services/user.service';
import { AnotherService } from './services/another.service';
import { UserEffects } from './user.effects';

@GapiModule({
    controllers: [
        UserQueriesController,
        UserSubscriptionsController,
        UserMutationsController
    ],
    services: [
        UserService,
        AnotherService
    ],
    effects: [
        UserEffects
    ]
})
export class UserModule {}