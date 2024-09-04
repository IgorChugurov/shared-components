import createRequestService from "./createRequestService";
import { initConfig, LSPrefix } from "../config/initConfig";
const refreshTokenUrl = initConfig.AuthData.refreshAuthSessionUrl;
const { VITE_AUTHHEADER, VITE_API_URL } = import.meta.env;

const requestService = createRequestService({
  lskey: `${LSPrefix}-user`,
  authheader: VITE_AUTHHEADER || "Authorization",
  refreshTokenUrl,
  bearer: true,
  apiUrl: VITE_API_URL || "http://localhost:3001",
});

export const sendRequest: any = requestService.sendRequest;
