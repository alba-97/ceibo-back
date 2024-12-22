import { EventDto } from "../interfaces/dto";
import { IEvent } from "../interfaces/entities";
import { Event } from "../models";

const fromEventDtoToEntity = (eventDto: EventDto) => {
  const { category, start_date, end_date, ...rest } = eventDto;
  const eventEntity: IEvent = new Event(rest);
  eventEntity.start_date = new Date(start_date);
  eventEntity.end_date = new Date(end_date);
  return eventEntity;
};

export default fromEventDtoToEntity;
