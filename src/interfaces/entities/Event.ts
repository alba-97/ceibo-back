import ICategory from "./Category";
import IComment from "./Comment";

export default interface IEvent {
  _id: string;
  title: string;
  description: string;
  img?: string;
  start_date: Date;
  end_date: Date;
  event_location: string;
  created_at: string;
  min_age: number;
  max_age: number;
  min_to_pay: number;
  total_to_pay: number;
  link_to_pay: string;
  deadline_to_pay: Date;
  category: ICategory;
  comments: IComment[];
  private: boolean;
  ended: boolean;
  save: () => {};
}
