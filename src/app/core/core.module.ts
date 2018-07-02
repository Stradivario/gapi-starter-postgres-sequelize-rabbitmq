
import { Module } from '@gapi/core';
import { SequelizeModule } from '@gapi/sequelize';
import { AuthService } from './services/auth/auth.service';

@Module({
    imports: [
        SequelizeModule.forRoot({
            dialect: 'postgres',
            host: process.env.DB_HOST || '182.10.0.4',
            port: process.env.DB_PORT || '5432',
            username: process.env.DB_USERNAME || 'dbuser',
            password: process.env.DB_PASSWORD || 'dbuserpass',
            name: process.env.DB_NAME || 'postgres',
            storage: ':memory:',
            logging: true,
            force: process.env.FORCE_RECREATE ? true : false,
            modelPaths: [process.cwd() + '/src/models']
          }
        ),
    ],
    services: [
        AuthService
    ]
})
export class CoreModule {}