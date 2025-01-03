import HttpError from "../interfaces/HttpError";
import { CommentMapper } from "../mappers";
import {
  EventRepository,
  CommentRepository,
  UserRepository,
} from "../repositories/";

export default class CommentsService {
  private commentRepository: CommentRepository;
  private eventRepository: EventRepository;
  private userRepository: UserRepository;
  private commentMapper: CommentMapper;
  constructor(dependencies: {
    commentRepository: CommentRepository;
    eventRepository: EventRepository;
    userRepository: UserRepository;
    commentMapper: CommentMapper;
  }) {
    this.commentRepository = dependencies.commentRepository;
    this.eventRepository = dependencies.eventRepository;
    this.userRepository = dependencies.userRepository;
    this.commentMapper = dependencies.commentMapper;
  }

  async addComment(eventId: string, userId: string, text: string) {
    const comment = this.commentMapper.fromDtoToEntity({
      userId,
      text,
      eventId,
    });

    const event = await this.eventRepository.findOneById(eventId);
    if (!event) throw new HttpError(404, "Event not found");
    comment.event = event;

    const user = await this.userRepository.findOneById(userId);
    if (!user) throw new HttpError(404, "User not found");
    comment.user = user;

    const newComment = await this.commentRepository.createOne(comment);

    await this.eventRepository.updateOneById(eventId, {
      comments: [...event.comments, newComment],
    });

    return newComment;
  }
}
