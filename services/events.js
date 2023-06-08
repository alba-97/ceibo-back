const { Event, Role, Category } = require("../models");
const { eventErrors } = require("./errors");
const { getUserById } = require("./users");

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
    const foundEvent = await Event.findById(eventId);
    return foundEvent;
  } catch (error) {
    console.log(error);
  }
};

exports.getAllEvents = async () => {
  try {
    const allEvents = await Event.find()
      .populate({
        path: "category",
        select: "name",
        model: "Category",
      })
      .exec();
    return allEvents;
  } catch (error) {
    console.log(error);
  }
};

exports.getUserEvents = async (userId) => {
  try {
    const roles = await Role.find({ user: userId }).populate("event");
    const events = roles.map((role) => role.event);
    return events;
  } catch (error) {
    console.log(error);
  }
};

exports.removeEvent = async (eventId) => {
  try {
    await Event.findByIdAndRemove(eventId);
  } catch (error) {
    console.log(error);
  }
};

exports.updateEventData = async (eventId, updatedData) => {
  try {
    await Events.findByIdAndUpdate(eventId, updatedData);
  } catch (error) {
    const response = eventErrors(error);
    throw response;
  }
};
