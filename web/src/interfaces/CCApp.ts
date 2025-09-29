export declare module CCApp {

  export interface Datum {
    approved: boolean;
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    dateCreated: Date;
    dateUpdated: string;
    __v: number;
    rejectReason: string;
  }

  export interface Data {
    success: boolean;
    status: number;
    data: Datum[];
  }

  export interface Transitional {
    silentJSONParsing: boolean;
    forcedJSONParsing: boolean;
    clarifyTimeoutError: boolean;
  }

  export interface Env {
    FormData?: any;
  }


  export interface Config {
    transitional: Transitional;
    transformRequest: any[];
    transformResponse: any[];
    timeout: number;
    xsrfCookieName: string;
    xsrfHeaderName: string;
    maxContentLength: number;
    maxBodyLength: number;
    env: Env;
    method: string;
    url: string;
  }

  export interface Request {
  }

  export interface RootObject {
    data: Data;
    status: number;
    statusText: string;
    headers: Headers;
    config: Partial<Config>;
    request: Request;
  }
}


