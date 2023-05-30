const Events = require("../models/Events");

exports.createNewEvent = async (eventData) => {
  try {
    let newEvent = await Events.create(eventData);
    return newEvent.save();
  } catch (error) {
    console.log({ message: error });
  }
};

exports.findEventById = async (eventId) => {
  try {
    let foundEvent = await Events.findById(eventId);
    return foundEvent;
  } catch (error) {
    console.log({ message: error });
  }
};

exports.getAllEvents = async () => {
  try {
    let allEvents = await Events.find();
    return allEvents;
  } catch (error) {
    console.log({ message: error });
  }
};

exports.removeEvent = async (eventId) => {
  try {
    await Events.findByIdAndRemove(eventId);
  } catch (error) {
    console.log({ message: error });
  }
};

exports.updateEventData = async (eventId, updatedData) => {
  try {
    await Events.findByIdAndUpdate(eventId, updatedData);
  } catch (error) {
    console.log({ message: error });
  }
};
