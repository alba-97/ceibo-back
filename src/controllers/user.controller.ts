import dotenv from "dotenv";
import { Request, Response } from "express";
import { UserService } from "../services";
import handleError from "../utils/handleError";
import { GET, POST, PUT, route } from "awilix-router-core";

dotenv.config();

@route("/users")
export default class UserController {
  private userService: UserService;
  constructor(dependencies: { userService: UserService }) {
    this.userService = dependencies.userService;
  }

  @route("/invite")
  @POST()
  public async inviteUsers(req: Request, res: Response) {
    try {
      await this.userService.inviteUsers(req.body, req.user._id);
      return res.status(200).send("Invitations sent");
    } catch (err) {
      handleError(res, err);
    }
  }

  @route("/login")
  @POST()
  public async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;
      const token = await this.userService.login(username, password);
      return res.status(200).send({ token });
    } catch (err) {
      handleError(res, err);
    }
  }

  @route("/signup")
  @POST()
  public async signup(req: Request, res: Response) {
    try {
      await this.userService.addUser(req.body);
      return res.status(200).send("User created");
    } catch (err) {
      handleError(res, err);
    }
  }

  @route("/preferences")
  @POST()
  public async addPreferences(req: Request, res: Response) {
    try {
      await this.userService.addPreferences(req.user._id, req.body);
      return res.status(200).send("Preferences added");
    } catch (err) {
      handleError(res, err);
    }
  }

  @route("/secret")
  @GET()
  public async secret(req: Request, res: Response) {
    try {
      const userPayload = await this.userService.getUserPayload(
        req.headers.authorization
      );
      req.user = userPayload;
      return res.send(userPayload);
    } catch (err) {
      handleError(res, err);
    }
  }

  @GET()
  public async getUsers(_: Request, res: Response) {
    try {
      const users = await this.userService.getUsers();
      return res.send(users);
    } catch (err) {
      handleError(res, err);
    }
  }

  @route("/find-email")
  @GET()
  public async findByEmail(req: Request, res: Response) {
    try {
      const { email } = req.body;
      const user = await this.userService.getUser({ email });
      return res.status(200).send(user);
    } catch (err) {
      handleError(res, err);
    }
  }

  @route("/me")
  @GET()
  public async me(req: Request, res: Response) {
    try {
      const user = await this.userService.getUserById(req.user._id);
      if (!user) return;
      res.send(user);
    } catch (err) {
      handleError(res, err);
    }
  }

  @route("/:id")
  @GET()
  public async getUser(req: Request, res: Response) {
    try {
      const user = await this.userService.getUserById(req.params.id);
      res.send(user);
    } catch (err) {
      handleError(res, err);
    }
  }

  @PUT()
  public async updateUser(req: Request, res: Response) {
    try {
      const user = await this.userService.updateUser(req.user._id, req.body);
      return res.send(user);
    } catch (err) {
      handleError(res, err);
    }
  }

  @route("/add-friend")
  @POST()
  public async addFriend(req: Request, res: Response) {
    try {
      await this.userService.addFriend(req.user._id, req.body.friendId);
      res.sendStatus(204);
    } catch (err) {
      handleError(res, err);
    }
  }

  @route("/remove-friend/:id")
  @PUT()
  public async removeUserFriend(req: Request, res: Response) {
    try {
      await this.userService.removeUserFriend(req.body.userId, req.params.id);
      res.sendStatus(204);
    } catch (error) {
      res.status(400).send(error);
    }
  }

  @route("/friends")
  @GET()
  public async getUserFriends(req: Request, res: Response) {
    try {
      const userFriends = await this.userService.getUserFriends(req.user._id);
      res.send(userFriends).status(200);
    } catch (err) {
      handleError(res, err);
    }
  }
}
