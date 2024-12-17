import { ICategory } from "../models/Category";

export interface EventQuery {
  searchTerm?: string;
  categoryId?: string;
  username?: string;
  future?: boolean;
  preferences?: ICategory[];
}
