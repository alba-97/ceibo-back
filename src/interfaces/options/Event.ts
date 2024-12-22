import { ICategory } from "../entities";

export default interface EventOptions {
  title?: string;
  searchTerm?: string;
  categoryId?: string;
  username?: string;
  future?: boolean;
  preferences?: ICategory[];
}
