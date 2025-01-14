import { IRating } from "../interfaces/entities";
import { RatingOptions } from "../interfaces/options";
import Paginated from "../interfaces/Paginated";
import { Rating } from "../models";

export default class RatingRepository {
  async findOne(query: RatingOptions): Promise<IRating | null> {
    const rating = await Rating.findOne(query);
    return rating;
  }

  async getAverage(query: RatingOptions): Promise<number> {
    const [{ avgRating }]: { avgRating: number }[] = await Rating.aggregate([
      {
        $match: query,
      },
      {
        $group: {
          _id: null,
          avgRating: {
            $avg: "$rating",
          },
        },
      },
    ]);
    return avgRating;
  }

  async findAll(
    query = {},
    pagination = { skip: 0, limit: 20 }
  ): Promise<Paginated<IRating>> {
    const { skip, limit } = pagination;
    const [data, total] = await Promise.all([
      Rating.find(query).skip(skip).limit(limit),
      Rating.countDocuments(query),
    ]);
    return { data, total };
  }

  async createOne(category: Partial<IRating>): Promise<IRating> {
    const newRating = new Rating(category);
    await newRating.save();
    return newRating;
  }

  async removeOneById(id: string): Promise<void> {
    await Rating.findByIdAndRemove(id);
  }
}
