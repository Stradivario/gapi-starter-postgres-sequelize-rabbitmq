import { Module } from '@rxdi/core';
import { AuthService } from './auth.service';
import { AuthModule } from '@gapi/auth';
import { readFileSync } from 'fs';

@Module({
    services: [AuthService],
    imports: [AuthModule.forRoot({
        algorithm: 'HS256',
        cert: readFileSync('./cert.key'),
        cyper: {
            algorithm: 'aes256',
            iv: 'Jkyt1H3FA8JK9L3B',
            privateKey: '8zTVzr3p53VC12jHV54rIYu2545x47lA'
        }
    })]
})
export class AuthTestingModule {}