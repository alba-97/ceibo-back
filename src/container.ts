import { createContainer, Lifetime, asValue, asClass } from "awilix";
import {
  CategoryService,
  CommentService,
  EventService,
  FileService,
  RoleService,
  UserService,
} from "./services";
import {
  CategoryRepository,
  CommentRepository,
  EmailRepository,
  EventRepository,
  FileRepository,
  RatingRepository,
  RoleRepository,
  UserRepository,
  WhatsappRepository,
} from "./repositories";
import {
  CategoryController,
  CommentController,
  EventController,
  FileController,
  UserController,
} from "./controllers";
import {
  CategoryMapper,
  CommentMapper,
  EventMapper,
  RoleMapper,
  UserMapper,
} from "./mappers";
import SeederService from "./services/seeder.service";

const container = createContainer();

container.register({
  categoryMapper: asClass(CategoryMapper).scoped(),
  userMapper: asClass(UserMapper).scoped(),
  roleMapper: asClass(RoleMapper).scoped(),
  eventMapper: asClass(EventMapper).scoped(),
  commentMapper: asClass(CommentMapper).scoped(),

  categoryRepository: asClass(CategoryRepository).scoped(),
  emailRepository: asClass(EmailRepository).scoped(),
  whatsappRepository: asClass(WhatsappRepository).scoped(),
  userRepository: asClass(UserRepository).scoped(),
  eventRepository: asClass(EventRepository).scoped(),
  roleRepository: asClass(RoleRepository).scoped(),
  fileRepository: asClass(FileRepository).scoped(),
  commentRepository: asClass(CommentRepository).scoped(),
  ratingRepository: asClass(RatingRepository).scoped(),

  userService: asClass(UserService).scoped(),
  eventService: asClass(EventService).scoped(),
  roleService: asClass(RoleService).scoped(),
  fileService: asClass(FileService).scoped(),
  commentService: asClass(CommentService).scoped(),
  categoryService: asClass(CategoryService).scoped(),
  seederService: asClass(SeederService).scoped(),

  eventController: asClass(EventController).scoped(),
  userController: asClass(UserController).scoped(),
  fileController: asClass(FileController).scoped(),
  commentController: asClass(CommentController).scoped(),
  categoryController: asClass(CategoryController).scoped(),
});

export default container;
