const data = require("./data.json");

const { User, Event } = require("./models");
const { createNewEvent } = require("./services/events");
const { createNewRole } = require("./services/roles");
const { getUsers } = require("./services/users");

exports.generateData = async () => {
  let count = await User.countDocuments({});
  if (count === 0) {
    for (let i = 0; i < data.users.length; i++) {
      const user = new User({
        username: data.users[i].username,
        password: data.users[i].password,
        email: data.users[i].email,
        first_name: data.users[i].first_name,
        last_name: data.users[i].last_name,
        birthdate: data.users[i].birthdate,
      });
      await user.save();
    }
  }

  count = await Event.countDocuments({});
  if (count === 0) {
    for (let i = 0; i < data.events.length; i++) {
      try {
        const eventData = {
          title: data.events[i].title,
          description: data.events[i].description,
          event_date: Date.parse(data.events[i].event_date),
          img: data.events[i].img,
          category: data.events[i].category,
          start_time: data.events[i].start_time,
          end_time: data.events[i].end_time,
        };
        const event = await createNewEvent(eventData);
        const users = await getUsers();

        console.log(users[i]);

        await createNewRole(users[i]._id, event._id, "Organizador");
      } catch (error) {}
    }
  }
};
