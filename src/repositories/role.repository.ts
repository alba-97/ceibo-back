import { Role } from "../models";
import { IEvent } from "../models/Event";
import { IRole } from "../models/Role";

const getOrganizerFromEvent = async (eventId: number) => {
  const role = await Role.findOne({
    role: "Organizer",
    event: eventId,
  }).populate({ path: "user", model: "User", select: "-password -salt" });
  return role?.user;
};

const getEventIdsFromOrganizer = async (organizerId: number) => {
  const events = await Role.find({
    role: "Organizer",
    user: organizerId,
  }).populate({ path: "event", model: "Event" });
  return events.map((item: IRole) => item.event._id);
};

const getRatingsFromEventIds = async (events: number[]) => {
  const roles = await Role.find({
    role: { $ne: "Organizer" },
    event: { $in: events },
  });

  const ratings: number[] = roles
    .map((item: IRole) => item.rating)
    .filter((item?: number) => item !== undefined);

  return ratings;
};

const getAvgRating = async (ratings: number[]) => {
  const sumRating = ratings.reduce(
    (total: number, rating: number) => total + rating,
    0
  );
  const avgRating = sumRating / ratings.length;
  return avgRating;
};

export default {
  getOrganizerFromEvent,
  getEventIdsFromOrganizer,
  getRatingsFromEventIds,
  getAvgRating,
};
