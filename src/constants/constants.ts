import { IPaginate } from "../types/request";

export const INIT_PAGINATE: IPaginate = {
  totalItems: 0,
  perPage: 25,
  currentPage: 1,
  loaded: false,
  query: {},
};
export const INIT_SETTINGS = {
  languages: ["en"],
  defaultLang: "en",
  emails: "",
  emailNotification: true,
};
