import { TestUtilService } from '../core/test-util/testing.service';
import { LOGIN_QUERY_TEST } from '../core/test-util/queries/login.query';
import { REGISTER_MUTATION } from '../core/test-util/mutations/register.mutation';
import { AuthPrivateService } from '../core/services/auth/auth.service';
import { Container } from '@gapi/core';
import { IQuery } from '../core/api-introspection/index';

const testUtil: TestUtilService = Container.get(TestUtilService);

describe('User Queries Controller', () => {

  it('e2e: queries => (loginUser) : Should sucessfully login user and return JWT Token', async done => {
    testUtil.sendRequest<IQuery>({
      query: `
        query login($email:String!, $password:String!) {
          login(email: $email, password: $password) {
            token
            user {
              id
              username
              type
              settings {
                sidebar
                language
              }
            }
          }
        }
      `,
      variables: {
        email: 'testing@gmail.com',
        password: '123456',
      }
    })
      .map(res => {
        expect(res.success).toBeTruthy();
        return res.data.login;
      })
      .subscribe(async res => {
        expect(res.token).toBeTruthy();
        expect(res.user.username).toBe('testing@gmail.com');
        expect(res.user.settings.sidebar).toBeTruthy();
        expect(res.user.settings.language).toBe('FR');
        expect(res.user.type).toBe('ADMIN');
        done();
      }, err => {
        expect(err).toBe(null);
        done();
      });
  });

  //   it('e2e: query => (register) : Should sucessfully register user', async done => {
  //     const fakeUser = {
  //       name: generateName(),
  //       email: generateEmail(),
  //       password: atcTestUtil.defaultPassword
  //     };
  //     atcTestUtil.sendRequest<IMutation>({
  //       query: REGISTER_MUTATION,
  //       variables: fakeUser
  //     })
  //       .map(res => {
  //         expect(res.success).toBeTruthy();
  //         return res.data.register;
  //       })
  //       .subscribe(async res => {
  //         expect(res.name).toBeTruthy();
  //         expect(res.credential.email).toBe(fakeUser.email);
  //         expect(res.credential.password).toBe(Container.get(AuthPrivateService).encryptPassword(atcTestUtil.defaultPassword));
  //         await User.destroy({ where: { id: res.id }});
  //         await Credential.destroy({ where: { userId: res.id } });
  //         done();
  //       }, err => {
  //         expect(err).toBe(null);
  //         done();
  //       });
  //   });

});
