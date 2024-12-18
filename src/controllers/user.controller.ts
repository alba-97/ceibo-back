import dotenv from "dotenv";
import { Request, Response } from "express";
import { userService } from "../services";
import handleError from "../utils/handleError";

dotenv.config();

const inviteUsers = async (req: Request, res: Response) => {
  try {
    await userService.inviteUsers(req.body, req.user._id);
    return res.status(200).send("Invitations sent");
  } catch (err) {
    handleError(res, err);
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const token = await userService.login(username, password);
    return res.status(200).send({ token });
  } catch (err) {
    handleError(res, err);
  }
};

const signup = async (req: Request, res: Response) => {
  try {
    await userService.addUser(req.body);
    return res.status(200).send("User created");
  } catch (err) {
    handleError(res, err);
  }
};

const addPreferences = async (req: Request, res: Response) => {
  try {
    const user = await userService.getUserById(req.user._id);
    await userService.addPreferences(user, req.body);
    return res.status(200).send("Preferences added");
  } catch (err) {
    handleError(res, err);
  }
};

const secret = async (req: Request, res: Response) => {
  const userPayload = await userService.getUserPayload(
    req.headers.authorization
  );
  req.user = userPayload;
  return res.send(userPayload);
};

const getUsers = async (_: Request, res: Response) => {
  try {
    const users = await userService.getUsers();
    return res.send(users);
  } catch (err) {
    handleError(res, err);
  }
};

const findByEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await userService.getUser({ email });
    return res.status(200).send(user);
  } catch (err) {
    handleError(res, err);
  }
};

const me = async (req: Request, res: Response) => {
  try {
    const user = await userService.getUserById(req.user._id);
    if (!user) return;
    res.send(user);
  } catch (err) {
    handleError(res, err);
  }
};

const getUser = async (req: Request, res: Response) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.send(user);
  } catch (err) {
    handleError(res, err);
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const user = await userService.updateUser(req.user._id, req.body);
    return res.send(user);
  } catch (err) {
    handleError(res, err);
  }
};

const addFriend = async (req: Request, res: Response) => {
  try {
    await userService.addFriend(req.user._id, req.body.friendId);
    res.sendStatus(204);
  } catch (err) {
    handleError(res, err);
  }
};

const removeUserFriend = async (req: Request, res: Response) => {
  try {
    await userService.removeUserFriend(req.body.userId, req.params.id);
    res.sendStatus(204);
  } catch (error) {
    res.status(400).send(error);
  }
};

const getUserFriends = async (req: Request, res: Response) => {
  try {
    const userFriends = await userService.getUserFriends(req.user._id);
    res.send(userFriends).status(200);
  } catch (err) {
    handleError(res, err);
  }
};

export {
  login,
  signup,
  secret,
  getUsers,
  findByEmail,
  me,
  getUser,
  updateUser,
  addPreferences,
  inviteUsers,
  addFriend,
  removeUserFriend,
  getUserFriends,
};
