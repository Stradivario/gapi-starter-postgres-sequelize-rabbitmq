import { Container } from '@gapi/core';
import { AuthPrivateService } from './auth.service';

const authService: AuthPrivateService = Container.get(AuthPrivateService);

describe('Auth Service', () => {
  it('unit: signJWTtoken => token : Should sucessfully sign jwt', async done => {
        const token = authService.signJWTtoken({
            email: 'dada@abv.bg',
            id: 1,
            scope: ['ADMIN']
        });
        expect(token).toBeTruthy();
        const verifyedToken = authService.verifyToken(token);
        expect(verifyedToken.email).toBe('dada@abv.bg');
        expect(verifyedToken.id).toBe(1);
        expect(verifyedToken.scope[0]).toBe('ADMIN');
        done();
  });


  it('unit: encryptPassword <=> decryptPassword : Should sucessfully encrypt and decrypt user password', async done => {
    const password = '123456';
    const encrypted = authService.encryptPassword(password);
    const decrypted = authService.decryptPassword(encrypted);
    expect(decrypted).toBe(password);
    done();
});
});
