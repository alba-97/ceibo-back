import data from "../data.json";
import { User, Event, Role, Comment } from "../models";
import {
  eventService,
  roleService,
  userService,
  commentService,
  categoryService,
} from "../services";

const generateData = async () => {
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
      continue;
    }
  }

  for (let i = 0; i < data.categories.length; i++) {
    try {
      await categoryService.createNewCategory(data.categories[i]);
    } catch (error) {
      continue;
    }
  }

  for (let i = 0; i < data.events.length; i++) {
    try {
      const event = await eventService.createNewEvent({
        title: data.events[i].title,
        description: data.events[i].description,
        event_location: data.events[i].event_location,
        event_date: data.events[i].event_date,
        img: data.events[i].img,
        category: data.events[i].category,
        start_time: data.events[i].start_time,
        end_time: data.events[i].end_time,
        private: data.events[i].private,
      });
      console.log(`Evento ${event.title} creado`);
    } catch {
      continue;
    }
  }

  let users = [];
  let events = [];

  const allRoles = await Role.find();
  const nRoles = allRoles.length;
  const allComments = await Comment.find();
  const nComments = allComments.length;

  for (let i = 0; i < data.roles.length; i++) {
    const user = await userService.getUser({ username: data.roles[i].user });
    const event = await Event.findOne({ title: data.roles[i].event });
    if (user) {
      users.push(user);
    }
    if (event) {
      events.push(event);
    }
  }

  if (nRoles == 0) {
    for (let i = 0; i < users.length; i++) {
      for (let j = 0; j < events.length; j++) {
        const role = j == i ? "Organizer" : "Member";
        const user = users[i];
        const event = events[j];
        let rating;

        if (role !== "Organizer" && user.username !== "clubDelPlan")
          rating = Math.random() * 5;

        await roleService.createNewRole({
          userId: user._id,
          eventId: event._id,
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
          const data = { user: users[j]._id, text: comments[counter] };
          await commentService.addComment(events[i]._id, data.user, data.text);
          console.log(
            `Comentario ${counter} de ${users[j].username} agregado a ${events[i].title}`
          );
          counter++;
        }
      }
    }
  }
  console.log("Datos falsos creados");
};

export default generateData;
