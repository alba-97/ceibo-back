import { ICategory } from "../entities";

export default interface EventOptions {
  searchTerm?: string;
  categoryId?: string;
  username?: string;
  future?: boolean;
  preferences?: ICategory[];
}
