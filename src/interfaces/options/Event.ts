export default interface EventOptions {
  title?: string;
  search?: string;
  searchTerm?: string;
  categoryId?: string;
  username?: string;
  minDate?: Date;
  maxDate?: Date;
  preferences?: string[];
  createdBy?: string;
}
