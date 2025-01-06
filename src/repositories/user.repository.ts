import { IUser } from "../interfaces/entities";
import { AddUser } from "../interfaces/entities/create";
import { UserOptions } from "../interfaces/options";
import Paginated from "../interfaces/Paginated";
import { User } from "../models";

type WhereClause = {
  username?: string | { $in: string[] };
  email?: string;
};

export default class UserRepository {
  async createOne(userData: AddUser) {
    const user = new User(userData);
    await user.validate();
    await user.save();
  }

  async updateOneById(
    userId: string,
    userData: Partial<AddUser>
  ): Promise<IUser | null> {
    return await User.findByIdAndUpdate(userId, userData, {
      select: "-password -salt -__v",
    });
  }

  async findAll(query: UserOptions = {}): Promise<Paginated<IUser>> {
    const { username, email, usernames } = query;

    const where: WhereClause = {};

    if (username) where.username = username;
    if (email) where.email = email;
    if (usernames) where.username = { $in: usernames };

    const [data, total] = await Promise.all([
      User.find(where, "-password -salt -__v").populate({
        path: "preferences",
        model: "Category",
      }),
      User.countDocuments(where),
    ]);
    return { data, total };
  }

  async findOne(query: UserOptions): Promise<IUser | null> {
    return await User.findOne(query, "-password -salt -__v").populate({
      path: "preferences",
      model: "Category",
    });
  }

  async findOneById(userId: string): Promise<IUser | null> {
    return await User.findById(userId, "-password -salt -__v").populate([
      {
        path: "preferences",
        model: "Category",
      },
      {
        path: "friends",
        model: "User",
      },
    ]);
  }
}
