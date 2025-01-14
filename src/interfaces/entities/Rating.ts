import IEvent from "./Event";
import IUser from "./User";

export default interface IRating {
  _id?: string;
  ratedBy: IUser;
  ratedEvent: IEvent;
  ratedUser: IUser;
  rating: number;
}
