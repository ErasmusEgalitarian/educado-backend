export interface User {
  _id: string;
  role: "user" | "admin" | "creator";
  firstName: string;
  lastName: string;
  email: string;
  joinedAt: string;
  dateUpdated: string;
}
