import IEvent from "./Event";
import IUser from "./User";

export default interface IComment {
  _id: string;
  text: string;
  user: IUser;
  event: IEvent;
}
