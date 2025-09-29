export interface NewApplication {
  baseUser: string | undefined;
  motivation: string;

  educationLevel: string[];
  status: string[];
  course: string[];
  institution: string[];
  educationStartDate: string[];
  educationEndDate: string[];

  company: string[];
  jobTitle: string[];
  workStartDate: string[];
  workEndDate: string[];
  description: string[];
}

export interface Application {
  baseUser: string;
  motivation: string;

  academicLevel: string[];
  academicStatus: string[];
  major: string[];
  institution: string;
  educationStartDate: string[];
  educationEndDate: string[];

  company: string[];
  position: string;
  workStartDate: string[];
  workEndDate: string[];
  workActivities: string[];
  isCurrentJob: boolean;
}
