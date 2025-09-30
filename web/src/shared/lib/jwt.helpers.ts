import jwt_decode from "jwt-decode";

interface Token {
  user: string;
  iat: number;
  exp: number;
}

export const isExpired = (token: string | null | undefined): boolean => {
  try {
    const { exp } = jwt_decode<Token>(token!);
    const expirationDatetimeInSeconds = exp * 1000;
    return Date.now() >= expirationDatetimeInSeconds;
  } catch {
    return true;
  }
};

const jwtHelpers = Object.freeze({ isExpired });

export default jwtHelpers;
