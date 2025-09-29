export declare module LoginResponseError {

    export interface Data {
        success: boolean;
        msg: string;
    }


    export interface Response {
        data: Data;
        status: number;
        statusText: string;
    }

    export interface RootObject {
        message: string;
        name: string;
        code: string;
        request: Request;
        response: Response;
    }

}