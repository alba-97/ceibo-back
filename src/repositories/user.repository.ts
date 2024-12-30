import { IUser } from "../interfaces/entities";
import { AddUser } from "../interfaces/entities/create";
import { UserOptions } from "../interfaces/options";
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

  async findAll(query: UserOptions = {}): Promise<IUser[]> {
    const { username, email, usernames } = query;

    const where: WhereClause = {};

    if (username) where.username = username;
    if (email) where.email = email;
    if (usernames) where.username = { $in: usernames };

    return await User.find(where, "-password -salt -__v").populate(
      "preferences",
      "Category"
    );
  }

  async findOne(query: UserOptions): Promise<IUser | null> {
    return await User.findOne(query, "-password -salt -__v").populate(
      "preferences",
      "Category"
    );
  }

  async findOneById(userId: string): Promise<IUser | null> {
    return await User.findById(userId, "-password -salt -__v").populate([
      "preferences",
      "friends",
    ]);
  }
}
