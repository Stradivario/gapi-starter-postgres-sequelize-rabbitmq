import { OfType, Effect } from '@gapi/core';
import { EffectTypes } from '../core/api-introspection/EffectTypes';

@Effect()
export class UserEffect {

    constructor(
        // private pubSub: PubSubService
    ) {}

    @OfType<EffectTypes>(EffectTypes.findUser)
    findUser(result, payload, context) {
        // this.pubSub.publish('Hello World', {myData: ''});
        // console.log(result, payload, context);
    }

}