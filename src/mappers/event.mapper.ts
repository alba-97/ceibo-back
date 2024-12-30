import { EventDto } from "../interfaces/dto";
import { AddEvent } from "../interfaces/entities/create";

export default class EventMapper {
  fromDtoToEntity(eventDto: EventDto) {
    const {
      start_date,
      end_date,
      title,
      description,
      img,
      event_location,
      min_age,
      max_age,
      min_to_pay,
      total_to_pay,
      link_to_pay,
      deadline_to_pay,
      private: _private,
    } = eventDto;

    const eventEntity: AddEvent = {
      title,
      description,
      event_location,
      start_date: new Date(start_date),
      end_date: new Date(end_date),
      comments: [],
      private: false,
      deadline_to_pay: deadline_to_pay ? new Date(deadline_to_pay) : new Date(),
    };

    if (img) eventEntity.img = img;
    if (min_age) eventEntity.min_age = min_age;
    if (max_age) eventEntity.max_age = max_age;
    if (min_to_pay) eventEntity.min_to_pay = min_to_pay;
    if (total_to_pay) eventEntity.total_to_pay = total_to_pay;
    if (link_to_pay) eventEntity.link_to_pay = link_to_pay;
    if (_private) eventEntity.private = _private;

    return eventEntity;
  }
}
