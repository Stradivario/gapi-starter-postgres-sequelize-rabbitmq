
import { GapiModule } from 'gapi';
import { UserQueriesController } from './user-queries.controller';
import { UserSubscriptionsController } from './user-subscriptions.controller';
import { UserMutationsController } from './user-mutations.controller';
import { UserService, AnotherService } from './services/user.service';


@GapiModule({
    controllers: [
        UserQueriesController,
        UserSubscriptionsController,
        UserMutationsController
    ],
    services: [
        UserService,
        AnotherService
    ]
})
export class UserModule {}