export declare namespace LoginResponse {
  export interface Data {
    success: boolean;
    token: string;
  }

  export interface Headers {
    contentLength: string;
    contentType: string;
  }

  export interface Transitional {
    silentJSONParsing: boolean;
    forcedJSONParsing: boolean;
    clarifyTimeoutError: boolean;
  }

  export interface Env {
    FormData?: any;
  }

  export interface Headers2 {
    Accept: string;
    ContentType: string;
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
    headers: Headers2;
    method: string;
    url: string;
    data: string;
  }

  export interface Request {}

  export interface RootObject {
    data: Data;
    status: number;
    statusText: string;
    headers: Headers;
    config: Config;
    request: Request;
  }
}
