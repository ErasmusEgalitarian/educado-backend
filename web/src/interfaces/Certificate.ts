import { Course, contentCreator } from "./Course";

export interface Certificate {
  course: Course;
  creator: contentCreator;
}

export interface CertificateIds {
  courseId: string;
  creatorId: string;
}
