import { IUser } from "../interfaces/entities";

export default class UserMapper {
  addUser(users: IUser[], user: IUser): IUser[] {
    return [...users, user];
  }

  removeUser(users: IUser[], user: IUser): IUser[] {
    return users.filter((_user) => _user._id !== user._id);
  }
}
