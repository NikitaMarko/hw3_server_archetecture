import {UserService} from "./userService.ts";
import {User} from "../model/userTypes.ts";

export class UserServiceEmbeddedImpl implements UserService{
    private users: User[] = [
        {
            "id": 2,
            "userName": "Bob"
        }
    ];
    addUser(user: User): boolean {
        if(this.users.findIndex((u:User) => u.id === user.id) === -1)
      {
          this.users.push(user);
          return true;
      }
      return false;
  }
    getAllUsers = ()=>[...this.users];

    updateUser = (newUserData:User):boolean => {
        const index = this.users.findIndex((u:User) => u.id === newUserData.id);
        if(index === -1){
            return false;
        }
        this.users[index] = {...this.users[index], ...newUserData};
        return true;
    }
    getUserById = (userId:number):User|null => {
        const user = this.users.find((u:User) => u.id === userId);
        return user || null;
    }
    removeUser = (userId:number):User|null => {
        const indexUser = this.users.findIndex((u=>u.id===userId))
        if(indexUser !== -1){
            const [removedUser] = this.users.splice(indexUser, 1);
            return removedUser;
        }
        return null;
    }
  }