const data = require("./data.json");

const { User, Event } = require("./models");
const { createNewEvent } = require("./services/events");
const { createNewRole } = require("./services/roles");
const { getUsers } = require("./services/users");

exports.generateData = async () => {
  for (let i = 0; i < data.users.length; i++) {
    try {
      const user = await User.findOne({
        username: data.users[i].username,
        email: data.users[i].email,
      });
      if (user) continue;

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
      console.log(error);
    }
  }

  for (let i = 0; i < data.events.length; i++) {
    try {
      const event = await Event.find({
        title: data.events[i].title,
      });
      if (event) continue;

      const newEvent = await createNewEvent({
        title: data.events[i].title,
        description: data.events[i].description,
        event_date: Date.parse(data.events[i].event_date),
        img: data.events[i].img,
        category: data.events[i].category,
        start_time: data.events[i].start_time,
        end_time: data.events[i].end_time,
      });

      const users = await getUsers();
      await createNewRole(users[i]._id, newEvent._id, "Organizador");
    } catch (error) {}
  }
};
