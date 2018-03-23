
import { GapiModule } from '@gapi/core';
import { UserModule } from './user/user.module';
import { CoreModule } from './core/core.module';

@GapiModule({
    imports: [
        UserModule,
        CoreModule
    ]
})
export class AppModule { }