import { IEvent } from "../models/Event";

export interface InvitationData {
  users: string[];
  plan: IEvent;
  method: "email" | "phone";
}
