import IEvent from "./Event";
import IUser from "./User";

export default interface IRole {
  _id?: string;
  user?: IUser;
  event?: IEvent;
  role: string;
}
