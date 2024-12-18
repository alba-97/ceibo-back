export default interface EventDto {
  title: string;
  description: string;
  img?: string;
  event_date: string;
  event_location: string;
  min_age?: number;
  max_age?: number;
  min_to_pay?: number;
  total_to_pay?: number;
  link_to_pay?: string;
  deadline_to_pay?: string;
  category: string;
  start_time: string;
  end_time: string;
  private?: boolean;
}
