import UserDto from "../interfaces/dto/user.dto";
import { IUser } from "../interfaces/entities";

export default class UserMapper {
  fromDtoToEntity(userDto: UserDto) {
    const {
      username,
      password,
      first_name,
      last_name,
      email,
      birthdate,
      phone,
      profile_img,
      address,
      new_user,
    } = userDto;

    const userEntity: Partial<IUser> = {
      username,
      password,
      email,
      first_name,
      last_name,
    };

    if (birthdate) userEntity.birthdate = birthdate;
    if (phone) userEntity.phone = phone;
    if (profile_img) userEntity.profile_img = profile_img;
    if (address) userEntity.address = address;
    if (new_user) userEntity.new_user = new_user;

    return userEntity;
  }

  addUser(users: IUser[], user: IUser): IUser[] {
    return [...users, user];
  }

  removeUser(users: IUser[], user: IUser): IUser[] {
    return users.filter((_user: IUser) => _user._id !== user._id);
  }
}
