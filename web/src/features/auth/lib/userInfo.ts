// TODO: DEPRECATE THIS FILE

export interface userInfo {
  firstName: string;
  lastName: string;
  email: string;
  id: string;
  role: string;
}

export const getUserInfo = (): Partial<userInfo> =>
  JSON.parse(localStorage.getItem("loggedInUser") ?? "{}");

export const setUserInfo = (userInfo: userInfo): void => {
  localStorage.setItem("loggedInUser", JSON.stringify(userInfo));
};
export const getUserToken = (): string => localStorage.getItem("token") ?? "";
