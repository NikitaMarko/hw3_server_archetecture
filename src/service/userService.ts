import {User} from "../model/userTypes.ts";

export interface UserService {
    addUser(user:User):boolean;
    getAllUsers():User[];
    updateUser(user:User):boolean;
    getUserById(id:number):User|null;
    removeUser(id:number):User|null;
}