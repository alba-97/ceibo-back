import { IEvent } from "../entities";

export default interface InvitationOptions {
  users: string[];
  plan: IEvent;
  method: "email" | "phone";
}
