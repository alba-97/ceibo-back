import data from "../seeder/data.json";
import {
  CategoryRepository,
  EventRepository,
  UserRepository,
  CommentRepository,
  RatingRepository,
} from "../repositories/";

export default class SeederService {
  private categoryRepository: CategoryRepository;
  private eventRepository: EventRepository;
  private userRepository: UserRepository;
  private commentRepository: CommentRepository;
  private ratingRepository: RatingRepository;
  constructor(dependencies: {
    categoryRepository: CategoryRepository;
    eventRepository: EventRepository;
    userRepository: UserRepository;
    commentRepository: CommentRepository;
    ratingRepository: RatingRepository;
  }) {
    this.categoryRepository = dependencies.categoryRepository;
    this.eventRepository = dependencies.eventRepository;
    this.userRepository = dependencies.userRepository;
    this.commentRepository = dependencies.commentRepository;
    this.ratingRepository = dependencies.ratingRepository;
  }
  async generateData() {
    for (let i = 0; i < data.users.length; i++) {
      const newUser = await this.userRepository.createOne({
        username: data.users[i].username,
        password: data.users[i].password,
        email: data.users[i].email,
        first_name: data.users[i].first_name,
        last_name: data.users[i].last_name,
        birthdate: new Date(data.users[i].birthdate),
        address: data.users[i].address,
      });
      console.log(`User ${newUser.username} created`);
    }

    for (let i = 0; i < data.categories.length; i++) {
      await this.categoryRepository.createOne({ name: data.categories[i] });
    }

    for (let i = 0; i < data.events.length; i++) {
      const category = await this.categoryRepository.findOne(
        data.events[i].category
      );
      if (!category) throw new Error("Category not found");

      const createdBy = await this.userRepository.findOne({
        username: data.events[i].createdBy,
      });
      if (!createdBy) throw new Error("User not found");

      const event = await this.eventRepository.createOne({
        title: data.events[i].title,
        description: data.events[i].description,
        event_location: data.events[i].event_location,
        start_date: new Date(data.events[i].start_date),
        end_date: new Date(data.events[i].end_date),
        img: data.events[i].img,
        category,
        private: false,
        createdBy,
      });
      console.log(`Event ${event.title} created`);
    }

    for (let i = 0; i < data.roles.length; i++) {
      const user = await this.userRepository.findOne({
        username: data.roles[i].user,
      });
      if (!user) throw new Error("User not found");
      const event = await this.eventRepository.findOne({
        title: data.roles[i].event,
      });
      if (!event) throw new Error("Event not found");
      await this.eventRepository.addUser(user._id, event._id);
      await this.userRepository.addEvent(event._id, user._id);
    }

    for (let i = 0; i < data.comments.length; i++) {
      const user = await this.userRepository.findOne({
        username: data.comments[i].user,
      });
      if (!user) throw new Error("User not found");
      const event = await this.eventRepository.findOne({
        title: data.comments[i].event,
      });
      if (!event) throw new Error("Event not found");
      const comment = await this.commentRepository.createOne({
        user,
        event,
        text: data.comments[i].text,
      });
      await this.eventRepository.updateOneById(event._id, {
        comments: [...event.comments, comment],
      });
    }

    for (let i = 0; i < data.ratings.length; i++) {
      const ratedBy = await this.userRepository.findOne({
        username: data.ratings[i].ratedBy,
      });
      if (!ratedBy) throw new Error("User not found");
      const ratedEvent = await this.eventRepository.findOne({
        title: data.ratings[i].ratedEvent,
      });
      if (!ratedEvent) throw new Error("Event not found");
      await this.ratingRepository.createOne({
        ratedBy,
        ratedEvent,
        ratedUser: ratedEvent.createdBy,
        rating: data.ratings[i].rating,
      });
    }

    console.log("Fake data created");
  }
}
