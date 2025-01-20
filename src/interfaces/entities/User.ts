import ICategory from "./Category";
import IEvent from "./Event";

export default interface IUser {
  _id: string;
  username: string;
  password: string;
  salt: string;
  first_name?: string;
  last_name?: string;
  email: string;
  birthdate?: Date;
  phone?: string;
  profile_img?: string;
  address?: string;
  preferences: ICategory[];
  new_user: boolean;
  friends: IUser[];
  events: IEvent[];
  rating?: number;
  validatePassword(password: string): Promise<boolean>;
  save: () => {};
}
