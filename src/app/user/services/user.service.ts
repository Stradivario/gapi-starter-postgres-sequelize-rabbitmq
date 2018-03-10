import { Service } from "gapi";
import { UserType } from "../types/user.type";
import { User } from '../../../models/User';

@Service()
export class AnotherService {
    trimFirstLetter(username: string): string {
        return username.charAt(1);
    }

    trimFirstLetterAsync(username): Promise<string> {
        return Promise.resolve(this.trimFirstLetter(username));
    }
}

@Service()
export class UserService {
    constructor(
        private anotherService: AnotherService
    ) { }

    findUser(id: number):  PromiseLike<User> {
        return User.find({where: {id}})
    }

    createUser(user: User): PromiseLike<User> {
        return User.create(user);
    }

    destroyUser(id: number): PromiseLike<number> {
        return User.destroy({where: {id}});
    }

    updateUser(id, user: {payload: User}):  PromiseLike<[number, User[]]> {
        return User.update(user.payload, { where: { id } });
    }

}