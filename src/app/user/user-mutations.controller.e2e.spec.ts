import { TestUtilService } from '../core/test-util/testing.service';
import { CREATE_USER_MUTATION } from '../core/test-util/mutations/createUser.mutation';
import { generateName } from '../core/test-util/randomNameGenerator';
import { Container } from '@gapi/core';
import { User } from '../../models/User';
import { IMutation } from '../core/api-introspection';
import { map } from 'rxjs/operators';

const TestUtil: TestUtilService = Container.get(TestUtilService);

beforeAll(() => TestUtil.init());
afterAll(() => TestUtil.destroy());

describe('User Controller', () => {

  it('e2e: mutation => (createUser) : Should sucessfully create user to database', async done => {
    const userName = generateName();
    TestUtil.sendRequest<IMutation>({
      query: CREATE_USER_MUTATION,
      variables: {
        username: userName,
        type: 'ADMIN'
      }
    })
      .pipe(
        map(res => {
          expect(res.success).toBeTruthy();
          return res.data.addUser;
        })
      )
      .subscribe(async res => {
        expect(res.id).toBeDefined();
        expect(res.username).toBe(userName);
        expect(res.type).toBe('ADMIN');
        await User.destroy({ where: { id: res.id }});
        done();
      }, err => {
        expect(err).toBe(null);
        done();
      });
  });

//   it('e2e: query => (login) : Should sucessfully login user and return authentication token', async done => {
//     TestUtil.sendRequest<IQuery>({
//       query: LOGIN_QUERY_TEST,
//       variables: {
//         email: TestUtil.users.USER.credential.email,
//         password: Container.get(AuthPrivateService).decryptPassword(TestUtil.users.USER.credential.password)
//       }
//     })
//       .map(res => {
//         expect(res.success).toBeTruthy();
//         return res.data.login;
//       })
//       .subscribe(res => {
//         expect(res.token).toBeTruthy();
//         expect(res.email).toBe(TestUtil.users.USER.credential.email);
//         expect(res.user.credential[0].password).toBe(TestUtil.users.USER.credential.password);
//         done();
//       }, err => {
//         expect(err).toBe(null);
//         done();
//       });
//   });

//   it('e2e: query => (register) : Should sucessfully register user', async done => {
//     const fakeUser = {
//       name: generateName(),
//       email: generateEmail(),
//       password: TestUtil.defaultPassword
//     };
//     TestUtil.sendRequest<IMutation>({
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
//         expect(res.credential.password).toBe(Container.get(AuthPrivateService).encryptPassword(TestUtil.defaultPassword));
//         await User.destroy({ where: { id: res.id }});
//         await Credential.destroy({ where: { userId: res.id } });
//         done();
//       }, err => {
//         expect(err).toBe(null);
//         done();
//       });
//   });

});
