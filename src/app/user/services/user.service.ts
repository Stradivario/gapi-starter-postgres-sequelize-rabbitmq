import { Service } from '@gapi/core';
import { User } from '../../../models/User';

@Service()
export class UserService {
    constructor(
    ) { }

    findUser(id: number): PromiseLike<User> {
        return User.find({where: {id}});
    }

    createUser(user: User): PromiseLike<User> {
        return User.create(user);
    }

    destroyUser(id: number): PromiseLike<number> {
        return User.destroy({where: {id}});
    }

    updateUser(id, user: {payload: User}): PromiseLike<[number, User[]]> {
        return User.update(user.payload, { where: { id } });
    }

}