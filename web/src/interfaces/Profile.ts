export interface Profile {
    id:           string;
    groups:       any[];
    firstName:    string;
    lastName:     string;
    user:         string;
    courseMember: any[];
    institution:  any[];
}


//Profile page interfaces
export interface FormData {
  UserName: string;
  UserEmail: string;
  bio: string;
  linkedin: string;
  photo: any;
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