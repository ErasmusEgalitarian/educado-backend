export interface ContentCreator {
  baseUser: string;
  approved: boolean;
  rejected: boolean;
  rejectionReason?: string;
}
