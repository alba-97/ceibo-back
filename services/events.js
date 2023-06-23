const { Event, Role, Category } = require("../models");

exports.createNewEvent = async (eventData) => {
  try {
    if (eventData.category) {
      let category = await Category.findOne({ name: eventData.category });
      if (!category) {
        category = await Category.create({ name: eventData.category });
      }
      eventData.category = category._id;
    } else {
      throw new Error("Ingrese una categoría para el evento");
    }

    if (!eventData.event_date) {
      throw new Error("Ingrese una fecha para el evento");
    }

    eventData.event_date = new Date(eventData.event_date);

    const newEvent = new Event(eventData);

    await newEvent.populate({
      path: "category",
      select: "name",
      model: "Category",
    });

    await newEvent.validate();
    await newEvent.save();
    return newEvent;
  } catch (error) {
    throw error;
  }
};

exports.findEventById = async (eventId) => {
  try {
    const event = await Event.findOne({ _id: eventId })
      .populate([
        {
          path: "comments",
          model: "Comment",
          populate: {
            path: "user",
            model: "User",
            select: "_id, username",
          },
        },
        {
          path: "category",
          model: "Category",
        },
      ])
      .exec();
    return event;
  } catch (error) {
    throw error;
  }
};

exports.getAllEvents = async () => {
  try {
    const allEvents = await Event.find({ private: false })
      .populate({
        path: "category",
        model: "Category",
      })
      .exec();
    return allEvents;
  } catch (error) {
    throw error;
  }
};

exports.getFilteredEvents = async (preferences) => {
  try {
    const events = await Event.find({
      private: false,
      event_date: { $gte: new Date() },
      category: { $in: preferences },
    })
      .populate({
        path: "category",
        model: "Category",
      })
      .exec();
    return events;
  } catch (error) {
    throw error;
  }
};

exports.getEventsByCategory = async (category) => {
  try {
    category = await Category.findOne({
      name: { $regex: category, $options: "i" },
    });
    category = category._id;

    const events = await Event.find({
      private: false,
      category,
    })
      .populate({
        path: "category",
        model: "Category",
      })
      .exec();
    return events;
  } catch (error) {
    throw error;
  }
};

exports.getEventsByUser = async (user) => {
  try {
    const roles = await Role.find({ user: user._id, private: false }).populate({
      path: "event",
      model: "Event",
      populate: {
        path: "category",
        select: "name",
        model: "Category",
      },
    });
    const events = roles.filter((role) => role.event).map((role) => role.event);
    return events;
  } catch (error) {
    throw error;
  }
};

exports.getEventsByQuery = async (text) => {
  try {
    const events = await Event.find({
      private: false,
      $or: [
        { title: { $regex: text, $options: "i" } },
        { description: { $regex: text, $options: "i" } },
      ],
    })
      .populate({
        path: "category",
        model: "Category",
      })
      .exec();
    return events;
  } catch (error) {
    throw error;
  }
};

exports.getUserEvents = async (userId) => {
  try {
    const roles = await Role.find({
      user: userId,
    }).populate({
      path: "event",
      model: "Event",
      populate: {
        path: "category",
        select: "name",
        model: "Category",
      },
    });
    const events = roles.filter((role) => role.event).map((role) => role.event);
    return events;
  } catch (error) {
    throw error;
  }
};

exports.removeEvent = async (eventId, userId) => {
  try {
    await Event.findByIdAndRemove(eventId);
    await Role.deleteMany({ event: eventId, user: userId });
  } catch (error) {
    throw error;
  }
};

exports.updateEventData = async (eventId, updatedData) => {
  try {
    if (updatedData["category"]) {
      updatedData["category"] = await Category.findOne({
        name: updatedData.category,
      });
    }
    await Event.findByIdAndUpdate(eventId, updatedData);
  } catch (error) {
    throw error;
  }
};

exports.checkEdit = async (eventId, userId) => {
  try {
    const role = await Role.findOne({ event: eventId, user: userId });
    if (!role) return false;
    return role.role === "Organizador";
  } catch (error) {
    throw error;
  }
};

exports.getOrganizer = async (eventId) => {
  try {
    let organizer = await Role.findOne({
      role: "Organizador",
      event: eventId,
    }).populate({ path: "user", model: "User", select: "-password -salt" });
    organizer = organizer.user;

    let organizerEvents = await Role.find({
      role: "Organizador",
      user: organizer._id,
    }).populate({ path: "event", model: "Event", select: "_id" });

    organizerEvents = organizerEvents.map((item) => item.event._id);

    const participantRoles = await Role.find({
      role: { $ne: "Organizador" },
      event: { $in: organizerEvents },
    });

    const ratings = participantRoles
      .map((item) => item.rating)
      .filter((item) => item >= 0);

    const sumRating = ratings.reduce((total, rating) => total + rating, 0);
    const avgRating = sumRating / ratings.length;
    let newOrganizer = { ...organizer.toObject() };
    newOrganizer.rating = avgRating;
    return newOrganizer;
  } catch (error) {
    throw error;
  }
};
