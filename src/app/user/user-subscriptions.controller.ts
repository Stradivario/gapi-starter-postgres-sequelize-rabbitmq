
import {
    GapiObjectType, GraphQLScalarType, GraphQLString, GapiController,
    GapiPubSubService, Type, Injector, Subscribe, Subscription, withFilter, Scope, GraphQLInt, GraphQLNonNull, Inject
} from 'gapi';
import { UserService } from './services/user.service';
import { UserMessageType, UserMessage } from './types/user-message.type';

@GapiController()
export class UserSubscriptionsController {

    @Injector(UserService) private userService: UserService;
    @Injector(GapiPubSubService) private static pubsub: GapiPubSubService;

    @Scope('ADMIN')
    @Type(UserMessageType)
    @Subscribe(() => UserSubscriptionsController.pubsub.asyncIterator('CREATE_SIGNAL_BASIC'))
    @Subscription()
    subscribeToUserMessagesBasic(message): UserMessage {
        return { message };
    }

    @Scope('ADMIN')
    @Type(UserMessageType)
    @Subscribe(
        withFilter(
            () => UserSubscriptionsController.pubsub.asyncIterator('CREATE_SIGNAL_WITH_FILTER'),
            (payload, {id}, context) => {
                console.log('Subscribed User: ', id, JSON.stringify(context));
                return true;
            }
        )
    )
    @Subscription({
        id: {
            type: new GraphQLNonNull(GraphQLInt)
        }
    })
    subscribeToUserMessagesWithFilter(message): UserMessage {
        return { message };
    }

}
