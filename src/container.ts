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
  EventRepository,
  FileRepository,
  RoleRepository,
  UserRepository,
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

const container = createContainer();

container.register({
  categoryMapper: asClass(CategoryMapper).scoped(),
  categoryRepository: asClass(CategoryRepository).scoped(),
  categoryService: asClass(CategoryService).scoped(),
  categoryController: asClass(CategoryController).scoped(),

  userMapper: asClass(UserMapper).scoped(),
  userRepository: asClass(UserRepository).scoped(),
  userService: asClass(UserService).scoped(),
  userController: asClass(UserController).scoped(),

  eventMapper: asClass(EventMapper).scoped(),
  eventController: asClass(EventController).scoped(),
  eventService: asClass(EventService).scoped(),
  eventRepository: asClass(EventRepository).scoped(),

  roleMapper: asClass(RoleMapper).scoped(),
  roleService: asClass(RoleService).scoped(),
  roleRepository: asClass(RoleRepository).scoped(),

  fileController: asClass(FileController).scoped(),
  fileService: asClass(FileService).scoped(),
  fileRepository: asClass(FileRepository).scoped(),

  commentMapper: asClass(CommentMapper).scoped(),
  commentController: asClass(CommentController).scoped(),
  commentService: asClass(CommentService).scoped(),
  commentRepository: asClass(CommentRepository).scoped(),
});

export default container;
