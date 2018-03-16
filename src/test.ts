import { TestUtilService } from './app/core/test-util/testing.service';
import { generateName } from './app/core/test-util/randomNameGenerator';
import { Container } from '@gapi/core';
import { UserSettings, User } from './models/User';
import { Credential } from './models/Credential';
import { AuthPrivateService } from './app/core/services/auth/auth.service';

interface FakeUser {
    username: string;
    settings: UserSettings;
    userType: 'ADMIN' | 'USER';
    email: string;
    password: string;
    wallets?: Array<string>;
}

export const TEST_CONFIG = {
    defaultPassword: '123456'
};

export const FAKE_USERS: FakeUser[] = [{
    username: 'Kristiyan Tachev',
    settings: {
        sidebar: true
    },
    email: 'kristiqn.tachev@gmail.com',
    password: TEST_CONFIG.defaultPassword,
    userType: 'ADMIN'
}, {
    username: 'Admin Account',
    settings: {
        sidebar: true
    },
    email: 'admin.account@gmail.com',
    password: TEST_CONFIG.defaultPassword,
    userType: 'ADMIN'
}, {
    username: 'User Account',
    settings: {
        sidebar: true
    },
    email: 'user.account@gmail.com',
    password: TEST_CONFIG.defaultPassword,
    userType: 'USER'
}, {
    username: 'Zdravko Tatarski',
    settings: {
        sidebar: true
    },
    email: 'zdravko.tatarski@gmail.com',
    password: TEST_CONFIG.defaultPassword,
    userType: 'USER'
}, {
    username: 'Ivan Spiridonov Admin',
    settings: {
        sidebar: true
    },
    email: 'pastir1@gmail.com',
    password: TEST_CONFIG.defaultPassword,
    userType: 'ADMIN'
}, {
    username: 'Ivan Spiridonov User',
    settings: {
        sidebar: true
    },
    email: 'pastir2@gmail.com',
    password: TEST_CONFIG.defaultPassword,
    userType: 'USER'
}];

const testUtil = Container.get(TestUtilService);

if (process.env.BEFORE_HOOK) {
    testUtil.setSequelizeConfig({ force: true });

    // Flush sequelize connection and force database to recreate table schema;
    testUtil.initSequelize();

    // Wait a little bit so Sequelize will finish building schema for example 1 sec then init fake users;
    setTimeout(() => {
        User.bulkCreate(FAKE_USERS, { individualHooks: true })
            .then(async (users) => {
                return await Promise.all(users.map(async user => {
                    const fakeUser = FAKE_USERS.filter(fu => fu.username === user.username)[0];
                    await Credential.create({
                        userId: user.id,
                        email: fakeUser.email,
                        password: Container.get(AuthPrivateService).encryptPassword(fakeUser.password)
                    });
                    return user;
                }));
            })
            .then((data) => {
                console.log(`Users successfully created! Count: ${data.length}`);
                process.exit(0);
            })
            .catch((e) => {
                console.error(e);
                process.exit(1);
            });
    }, 1000);
} else {
    process.exit(0);
}
