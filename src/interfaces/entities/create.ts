import ICategory from "./Category";
import IComment from "./Comment";
import IEvent from "./Event";
import IRole from "./Role";
import IUser from "./User";

type OmitTimestamps<T> = Omit<T, "_id" | "created_at" | "updated_at">;

export interface AddCategory extends OmitTimestamps<ICategory> {}
export interface AddEvent extends OmitTimestamps<IEvent> {}
export interface AddComment extends OmitTimestamps<IComment> {}
export interface AddRole extends OmitTimestamps<IRole> {}
export interface AddUser extends OmitTimestamps<IUser> {}
