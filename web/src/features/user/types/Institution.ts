export interface Institution {
  _id?: string;
  institutionName: string;
  domain: string;
  secondaryDomain: string;
  [key: string]: unknown;
}
