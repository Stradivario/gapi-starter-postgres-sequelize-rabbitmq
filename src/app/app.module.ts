
import { GapiModule, GapiServerModule } from 'gapi';
import { UserModule } from './user/user.module';
import { UserService } from './user/services/user.service';
import { CoreModule } from './core/core.module';

@GapiModule({
    imports: [
        UserModule,
        CoreModule
    ]
})
export class AppModule { }