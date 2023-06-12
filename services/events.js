const { Event, Role, Category, Comment } = require("../models");
const { eventErrors } = require("./errors");

exports.createNewEvent = async (eventData) => {
  try {
    if (eventData.category) {
      let category = await Category.findOne({ name: eventData.category });
      if (!category) {
        category = await Category.create({ name: eventData.category });
      }
      eventData.category = category._id;
    }
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
      .populate({
        path: "comments",
        model: "Comment",
        populate: {
          path: "user",
          model: "User",
          select: "_id, username",
        },
      })
      .exec();
    return event;
  } catch (error) {
    throw error;
  }
};

exports.getAllEvents = async () => {
  try {
    const allEvents = await Event.find()
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
    const events = await Event.find({ category: { $in: preferences } })
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
    const roles = await Role.find({ user: userId }).populate({
      path: "event",
      model: "Event",
      populate: {
        path: "category",
        select: "name",
        model: "Category",
      },
    });
    const events = roles.map((role) => role.event);
    return events;
  } catch (error) {
    throw error;
  }
};

exports.removeEvent = async (eventId) => {
  try {
    await Event.findByIdAndRemove(eventId);
  } catch (error) {
    throw error;
  }
};

exports.updateEventData = async (eventId, updatedData) => {
  try {
    await Event.findByIdAndUpdate(eventId, updatedData);
  } catch (error) {
    const response = eventErrors(error);
    throw response;
  }
};
