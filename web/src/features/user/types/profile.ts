export interface Profile {
  id: string;
  groups: unknown[];
  firstName: string;
  lastName: string;
  user: string;
  courseMember: unknown[];
  institution: unknown[];
}

//Profile page interfaces
export interface FormData {
  userName: string;
  userEmail: string;
  bio: string;
  linkedin: string;
  photo: unknown;
}

export interface EducationFormData {
  educationLevel: string;
  status: string;
  course: string;
  institution: string;
  educationStartDate: string;
  educationEndDate: string;
  _id: string | null;
}

export interface ExperienceFormData {
  company: string;
  jobTitle: string;
  workStartDate: string;
  workEndDate: string;
  isCurrentJob: boolean;
  description: string;
  _id: string | null;
}
