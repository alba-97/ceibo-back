import data from "../seeder/data.json";
import { IEvent, IUser } from "../interfaces/entities";
import { User, Comment } from "../models";
import {
  CategoryRepository,
  EventRepository,
  UserRepository,
  CommentRepository,
  RoleRepository,
} from "../repositories/";

export default class SeederService {
  private categoryRepository: CategoryRepository;
  private eventRepository: EventRepository;
  private userRepository: UserRepository;
  private commentRepository: CommentRepository;
  private roleRepository: RoleRepository;
  constructor(dependencies: {
    categoryRepository: CategoryRepository;
    eventRepository: EventRepository;
    userRepository: UserRepository;
    commentRepository: CommentRepository;
    roleRepository: RoleRepository;
  }) {
    this.categoryRepository = dependencies.categoryRepository;
    this.eventRepository = dependencies.eventRepository;
    this.userRepository = dependencies.userRepository;
    this.commentRepository = dependencies.commentRepository;
    this.roleRepository = dependencies.roleRepository;
  }
  async generateData() {
    for (let i = 0; i < data.users.length; i++) {
      try {
        const newUser = new User({
          username: data.users[i].username,
          password: data.users[i].password,
          email: data.users[i].email,
          first_name: data.users[i].first_name,
          last_name: data.users[i].last_name,
          birthdate: data.users[i].birthdate,
          address: data.users[i].address,
        });
        await newUser.save();
        console.log(`Usuario ${newUser.username} creado`);
      } catch (error) {
        console.log("Error creating users: ", error);
        continue;
      }
    }

    for (let i = 0; i < data.categories.length; i++) {
      try {
        await this.categoryRepository.createOne({ name: data.categories[i] });
      } catch (error) {
        console.log("Error creating categories: ", error);
        continue;
      }
    }

    for (let i = 0; i < data.events.length; i++) {
      try {
        const category = await this.categoryRepository.findOne(
          data.events[i].category
        );
        if (!category) throw new Error("Category not found");
        const event = await this.eventRepository.createOne({
          title: data.events[i].title,
          description: data.events[i].description,
          event_location: data.events[i].event_location,
          start_date: new Date(data.events[i].start_date),
          end_date: new Date(data.events[i].end_date),
          img: data.events[i].img,
          category,
          private: false,
          comments: [],
        });
        console.log(`Evento ${event.title} creado`);
      } catch (error) {
        console.log("Error creating events: ", error);
        continue;
      }
    }

    let users: IUser[] = [];
    let events: IEvent[] = [];

    const { data: allRoles } = await this.roleRepository.findAll();
    const nRoles = allRoles.length;

    const allComments = await Comment.find();
    const nComments = allComments.length;

    for (let i = 0; i < data.roles.length; i++) {
      const user = await this.userRepository.findOne({
        username: data.roles[i].user,
      });
      const event = await this.eventRepository.findOne({
        title: data.roles[i].event,
      });
      if (user) users.push(user);
      if (event) events.push(event);
    }

    if (nRoles == 0) {
      for (let i = 0; i < users.length; i++) {
        for (let j = 0; j < events.length; j++) {
          const role = j == i ? "Organizer" : "Member";
          const user = users[i];
          const event = events[j];
          const rating =
            role !== "Organizer" && user.username !== "clubDelPlan"
              ? Math.random() * 5
              : 0;

          await this.roleRepository.createOne({
            user,
            event,
            role,
            rating,
          });

          console.log(
            `${user.username} agregado a ${event.title} como ${role} (${rating})`
          );
        }
      }
    }
    if (nComments == 0) {
      for (let i = 0; i < events.length; i++) {
        const title = events[i].title;
        const commentsObj = data.comments as { [key: string]: string[] };
        const comments = commentsObj[title];
        let counter = 0;
        for (let j = 0; j < users.length; j++) {
          if (j !== i && counter < comments.length) {
            await this.commentRepository.createOne({
              event: events[i],
              user: users[j],
              text: comments[counter],
            });
            console.log(
              `Comentario ${counter} de ${users[j].username} agregado a ${events[i].title}`
            );
            counter++;
          }
        }
      }
    }
    console.log("Datos falsos creados");
  }
}
