import { OfType, GapiEffect, GapiPubSubService } from '@gapi/core';
import { EffectTypes } from '../core/api-introspection/EffectTypes';

@GapiEffect()
export class UserEffect {

    constructor(
        private pubSub: GapiPubSubService
    ) {}

    @OfType<EffectTypes>(EffectTypes.findUser)
    findUser(result, payload, context) {
        // this.pubSub.publish('Hello World', {myData: ''});
        // console.log(result, payload, context);
    }

}