const Events = require("../models/Events");
const { eventErrors } = require("./errors");

exports.createNewEvent = async (eventData) => {
  try {
    const newEvent = new Events(eventData);
    await newEvent.validate();
    await newEvent.save();
    return newEvent;
  } catch (error) {
    const response = eventErrors(error);
    throw response;
  }
};

exports.findEventById = async (eventId) => {
  try {
    let foundEvent = await Events.findById(eventId);
    return foundEvent;
  } catch (error) {
    console.log(error);
  }
};

exports.getAllEvents = async () => {
  try {
    let allEvents = await Events.find();
    return allEvents;
  } catch (error) {
    console.log(error);
  }
};

exports.removeEvent = async (eventId) => {
  try {
    await Events.findByIdAndRemove(eventId);
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
