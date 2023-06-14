const data = require("./data.json");

const { User, Event, Role } = require("./models");
const { createNewEvent } = require("./services/events");
const { createNewRole } = require("./services/roles");
const { findUserByUsername } = require("./services/users");

exports.generateData = async () => {
  /*
  for (let i = 0; i < data.users.length; i++) {
    await User.deleteOne({ username: data.users.username });
  }

  for (let i = 0; i < data.events.length; i++) {
    await Event.deleteOne({ title: data.events.title });
  }
  */

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

  for (let i = 0; i < data.events.length; i++) {
    try {
      const event = await createNewEvent({
        title: data.events[i].title,
        description: data.events[i].description,
        event_date: Date.parse(data.events[i].event_date),
        img: data.events[i].img,
        category: data.events[i].category,
        start_time: data.events[i].start_time,
        end_time: data.events[i].end_time,
      });
      console.log(`Evento ${event.title} creado`);
    } catch {
      continue;
    }
  }
  let users = [];
  let events = [];

  const roles = await Role.find();
  if (roles.length == 0) {
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

    for (let i = 0; i < users.length; i++) {
      for (let j = 0; j < events.length; j++) {
        const role = j == i ? "Organizador" : "Participante";
        const user = users[i];
        const event = events[j];
        const rating = role == "Participante" ? Math.random() * 5 : null;
        await createNewRole(user._id, event._id, role, rating);
        const message = `${user.username} agregado a ${event.title} como ${role} (${rating})`;
        console.log(message);
      }
    }
  }
};
