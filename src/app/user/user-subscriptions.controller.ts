
import {
    Controller, PubSubService, Type, Injector, Subscribe,
    Subscription, withFilter, Scope, GraphQLInt, GraphQLNonNull
} from '@gapi/core';
import { UserMessage } from './types/user-message.type';

@Controller()
export class UserSubscriptionsController {

    @Injector(PubSubService) private static pubsub: PubSubService;

    @Scope('ADMIN')
    @Type(UserMessage)
    @Subscribe(() => UserSubscriptionsController.pubsub.asyncIterator('CREATE_SIGNAL_BASIC'))
    @Subscription()
    subscribeToUserMessagesBasic(message): UserMessage {
        return { message };
    }

    @Scope('ADMIN')
    @Type(UserMessage)
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
