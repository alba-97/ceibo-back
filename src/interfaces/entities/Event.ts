import ICategory from "./Category";
import IComment from "./Comment";
import IUser from "./User";

export default interface IEvent {
  _id: string;
  created_at: string;
  title: string;
  description: string;
  img?: string;
  start_date: Date;
  end_date: Date;
  location: string;
  min_age?: number;
  max_age?: number;
  min_to_pay?: number;
  total_to_pay?: number;
  link_to_pay?: string;
  deadline_to_pay?: Date;
  category: ICategory;
  createdBy: IUser;
  comments: IComment[];
  private: boolean;
  ended?: boolean;
  users: IUser[];
}
