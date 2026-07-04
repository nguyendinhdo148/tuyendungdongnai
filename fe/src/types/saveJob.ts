import { Job } from "./job";
import { User } from "./user";

export interface SaveJob {
  _id: string;
  user: User;
  job: Job;
  createdAt: string;
  updatedAt: string;
}
