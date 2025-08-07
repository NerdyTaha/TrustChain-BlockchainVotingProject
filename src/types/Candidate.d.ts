import { Institute } from "./Institute";

export interface Candidate {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  isApproved: boolean;
  role: string;
  profileImage: string;
  institute: Institute;
}
