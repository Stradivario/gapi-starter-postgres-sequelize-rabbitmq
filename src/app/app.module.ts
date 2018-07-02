
import { Module } from '@gapi/core';
import { UserModule } from './user/user.module';
import { CoreModule } from './core/core.module';

@Module({
    imports: [
        UserModule,
        CoreModule
    ]
})
export class AppModule { }