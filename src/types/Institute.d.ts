import { User } from "./user";

export interface Institute {
  _id: string;
  name: string;
  owner: User;
}
