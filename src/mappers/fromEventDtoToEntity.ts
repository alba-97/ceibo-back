import { EventDto } from "../interfaces/dto";
import { Event } from "../models";

const fromEventDtoToEntity = (eventDto: EventDto | Partial<EventDto>) => {
  const { category, ...rest } = eventDto;
  const eventEntity = new Event(rest);
  return eventEntity;
};

export default fromEventDtoToEntity;
