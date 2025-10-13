export interface userInfo {
  firstName: string;
  lastName: string;
  email: string;
  id: string;
  role: string;
}

export const getUserInfo = (): userInfo =>
  JSON.parse(localStorage.getItem("userInfo") ?? "{}");

export const setUserInfo = (userInfo: userInfo): void => {
  localStorage.setItem("userInfo", JSON.stringify(userInfo));
};
export const getUserToken = (): string => localStorage.getItem("token") ?? "";
