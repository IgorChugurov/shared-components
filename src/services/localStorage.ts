import { LSPrefix } from "../config/initConfig";

export const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem(`${LSPrefix}-user`) ?? "null");
  } catch (e) {
    return null;
  }
};
export const setUser = (user: any) =>
  localStorage.setItem(`${LSPrefix}-user`, JSON.stringify(user));

export const setUserSettingsInLS = (data: any) =>
  localStorage.setItem(LSPrefix + "-userSettings", JSON.stringify(data));

export const getUserSettings = () => {
  try {
    return JSON.parse(
      localStorage.getItem(`${LSPrefix}-userSettings`) ?? "null"
    );
  } catch (error) {
    return null;
  }
};
export const getListData = () => {
  try {
    return JSON.parse(localStorage.getItem(`${LSPrefix}-listData`) ?? "{}");
  } catch (error) {
    return {};
  }
};
export const setListData = (user: string, list: string, paginate: any) => {
  let data = getListData();
  //console.log(data);
  if (!data) {
    data = {};
  }
  if (!data[user]) {
    data[user] = {};
  }
  if (!data[user][list]) {
    data[user][list] = {};
  }
  data[user][list].paginate = paginate;

  localStorage.setItem(`${LSPrefix}-listData`, JSON.stringify(data));
};

export const getDarkModeLS = () => {
  try {
    return localStorage.getItem(`${LSPrefix}-DarkMode`) ?? "light";
  } catch (error) {
    return "light";
  }
};
export const setDarkModeLS = (data: string) => {
  localStorage.setItem(`${LSPrefix}-DarkMode`, data);
};

export const getCurrentProjectLS = () => {
  try {
    return localStorage.getItem(`${LSPrefix}-CurrentProject`) ?? "";
  } catch (error) {
    return "light";
  }
};
export const setCurrentProjectLS = (data: string) => {
  localStorage.setItem(`${LSPrefix}-CurrentProject`, data);
};
export const getCurrentFacilityLS = () => {
  try {
    return localStorage.getItem(`${LSPrefix}-CurrentFacility`) ?? "";
  } catch (error) {
    return "light";
  }
};
export const setCurrentFacilityLS = (data: string) => {
  localStorage.setItem(`${LSPrefix}-CurrentFacility`, data);
};
