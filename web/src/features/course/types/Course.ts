import { Answer } from "@/exercise/types/Answer";
import { User } from "@/user/types/User";

export interface Main {
  status: number;
  success: boolean;
  count: number;
  data: Course[];
}

// TODO: Make sure this is in accordance with the backend
interface CommonCourse {
  _id: string;
  title: string;
  description: string;

  //1: beginner, 2: intermediate, 3: advanced. This should be changed to enums on database instead of numbers
  difficulty: 0 | 1 | 2 | 3;
  dateCreated?: Date;
  dateUpdated?: Date;
  coverImg?: string;
  category:
    | ""
    | "personal finance"
    | "health and workplace safety"
    | "sewing"
    | "electronics";
  sections: string[];
  status: "draft" | "published" | "hidden";
  estimatedHours: number;
  rating?: number;
  numOfSubscriptions?: number;
  __v?: number;
}

export interface Course extends CommonCourse {
  creator: string;
}

export interface CreatorPopulatedCourse extends CommonCourse {
  creator: {
    _id: string;
    approved: boolean;
    rejected: boolean;
    baseUser: User;
  };
}

export interface NewCourse extends Omit<CommonCourse, "_id"> {
  creator: string;
}

export interface contentCreator {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  motivation: string;
  approved: boolean;
  rejectionReason: string;
  dateCreated: Date;
  dateUpdated: Date;
}

export interface Section {
  _id: string;
  title: string;
  description: string;
  totalPoints?: number;
  parentCourse: string;
  components: Component[];
  __v: number;
}

export interface Component {
  compId: string;
  compType: string;
  _id: string;
}

export interface Lecture {
  parentSection: string;
  _id: string;
  title: string;
  description: string;
  contentType: string;
  content: string;
}

export interface Media {
  id: string;
  file: File;
  parentType: string;
}

export interface Exercise {
  _id: string;
  parentSection: string;
  title: string;
  question: string;
  answers?: Answer[];
}

export interface FormattedCourse {
  courseInfo: {
    _id: string;
    title: string;
    category: string;
    difficulty: number;
    description: string;
    coverImg: Media | null;
    status: string;
    creator: string;
  };
  sections:
    | {
        _id: string;
        title: string;
        description: string;
        components: {
          compType: string;
          component: Lecture | Exercise;
          video: Media | null;
        }[];
      }[]
    | null;
}

export type SubmitFunction = (
  formData: FormData,
  token: string,
) => Promise<void>;
