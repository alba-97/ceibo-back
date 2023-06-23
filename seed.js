const data = require("./data.json");

const { User, Event, Role, Comment } = require("./models");
const { createNewEvent } = require("./services/events");
const { createNewRole } = require("./services/roles");
const { findUserByUsername } = require("./services/users");
const { addComment } = require("./services/comments");
const { createNewCategory } = require("./services/categories");

exports.generateData = async () => {
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
      await createNewCategory(data.categories[i]);
    } catch (error) {
      continue;
    }
  }

  for (let i = 0; i < data.events.length; i++) {
    try {
      const event = await createNewEvent({
        title: data.events[i].title,
        description: data.events[i].description,
        location: data.events[i].location,
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
    const user = await findUserByUsername(data.roles[i].user);
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
        const role = j == i ? "Organizador" : "Participante";
        const user = users[i];
        const event = events[j];
        const rating =
          role !== "Organizador" && user.username !== "clubDelPlan"
            ? Math.random() * 5
            : null;
        await createNewRole(user._id, event._id, role, rating);
        console.log(
          `${user.username} agregado a ${event.title} como ${role} (${rating})`
        );
      }
    }
  }
  if (nComments == 0) {
    for (let i = 0; i < events.length; i++) {
      const comments = data.comments[events[i].title];
      let counter = 0;
      for (let j = 0; j < users.length; j++) {
        if (j !== i && counter < comments.length) {
          const data = { user: users[j]._id, text: comments[counter] };
          await addComment(events[i], data);
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
