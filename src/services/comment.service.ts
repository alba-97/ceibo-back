import HttpError from "../interfaces/HttpError";
import { fromCommentDtoToEntity } from "../mappers";
import {
  commentRepository,
  eventRepository,
  userRepository,
} from "../repositories";

const addComment = async (eventId: string, userId: string, text: string) => {
  const comment = fromCommentDtoToEntity({
    userId,
    text,
    eventId,
  });

  const event = await eventRepository.getEventById(eventId);
  if (!event) throw new HttpError(404, "Event not found");
  comment.event = event;

  const user = await userRepository.getUserById(userId);
  if (!user) throw new HttpError(404, "User not found");
  comment.user = user;

  const newComment = await commentRepository.addComment(comment);
  event.comments = [...event.comments, newComment];
  await event.save();
  return newComment;
};

export default { addComment };
