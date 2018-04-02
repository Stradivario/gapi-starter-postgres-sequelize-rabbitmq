import { OfType, Service } from '@gapi/core';
import { EffectTypes } from '../core/api-introspection/EffectTypes';

@Service()
export class UserEffects {

    @OfType<EffectTypes>(EffectTypes.findUser)
    findUser(payload, context) {
        console.log(payload, context);
    }

}