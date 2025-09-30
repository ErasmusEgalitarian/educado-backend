import { contentCreator, Course } from "@/course/types/Course";

export interface Certificate {
  course: Course;
  creator: contentCreator;
}

export interface CertificateIds {
  courseId: string;
  creatorId: string;
}
