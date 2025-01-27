export default interface EventDto {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  img?: string;
  location: string;
  min_age?: number;
  max_age?: number;
  min_to_pay?: number;
  total_to_pay?: number;
  link_to_pay?: string;
  deadline_to_pay?: string;
  category: string;
  private?: boolean;
}
