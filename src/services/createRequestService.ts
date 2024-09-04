import { jwtDecode } from "jwt-decode";
import { getCurrentFacilityLS, getCurrentProjectLS } from "./localStorage";
interface IRequestParams {
  url: string;
  method?: string;
  body?: any;
  queryString?: any;
  multipart?: boolean;
  currentPage?: number;
  perPage?: number;
  search?: string;
  headers?: { [key: string]: string };
  limit?: number;
  skip?: number;
  params?: any;
}
type HeadersType = Record<string, string>;
interface IRequest {
  method: string;
  body?: any;
  headers: HeadersType;
}
function createRequestService({
  lskey,
  authheader,
  refreshTokenUrl,
  apiUrl,
  bearer = true,
}: {
  lskey: string;
  authheader: string;
  refreshTokenUrl: string;
  apiUrl: string;
  bearer?: boolean;
}) {
  const getUser = () => {
    try {
      return JSON.parse(localStorage.getItem(lskey) ?? "null");
    } catch (e) {
      return null;
    }
  };
  const setUser = (user: any) => {
    localStorage.setItem(lskey, JSON.stringify(user));
  };

  // to hold the failed requests.
  let accessTokenPromise: Promise<any> | null = null;
  //to ensure that only one token refresh request is made at a time.
  let isRefreshingAccessToken = false;

  const decodeToken = (user: any) => {
    let decodedToken = { exp: 0 };
    if (user && user.accessToken && user.accessToken.length > 10) {
      decodedToken = jwtDecode(user.accessToken);
    }
    return decodedToken;
  };

  const handleSuccessfulTokenRefresh = async (user: any): Promise<any> => {
    if (!isRefreshingAccessToken) {
      isRefreshingAccessToken = true;
      accessTokenPromise = refreshToken(user).finally(() => {
        isRefreshingAccessToken = false;
        accessTokenPromise = null;
      });
      await accessTokenPromise;
    } else {
      // Если уже выполняется обновление токена, возвращаем промис, который разрешится после обновления
      return accessTokenPromise?.then();
    }
  };

  const send = async (data: IRequestParams) => {
    const user = getUser();

    // const decodedToken = decodeToken(user);
    // if (decodedToken.exp - 20 < Date.now() / 1000 && decodedToken.exp !== 0) {
    //   try {
    //     await handleSuccessfulTokenRefresh(user);
    //   } catch (error) {
    //     console.error("Failed to refresh token:", error);
    //     accessTokenPromise = null;
    //     setUser(null);
    //     window.location.href = "/";
    //     throw error;
    //     // clear the old promise so that the next request can start trying to update the token again
    //   }
    // }
    if (user.exp && user.exp - Date.now() / 1000 < 10) {
      try {
        await handleSuccessfulTokenRefresh(user);
      } catch (error) {
        console.error("Failed to refresh token:", error);
        accessTokenPromise = null;
        setUser(null);
        window.location.href = "/";
        throw error;
        // clear the old promise so that the next request can start trying to update the token again
      }
    }
    const { url, request } = getUrlAndRequest(data);
    //console.log(data, request);

    try {
      const response = await fetch(apiUrl + url, request);
      if (response.status < 300) {
        try {
          //console.log(response);
          const d = await response.json();
          return d;
        } catch (error) {
          console.log(error);
          throw error;
        }
      } else {
        const err = await response?.json();
        throw err;
      }
    } catch (err: any) {
      console.log(err);
      throw err;
    }
  };

  const refreshToken = async (user: any) => {
    const headers: HeadersType = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    const request: IRequest = {
      method: "POST",
      headers: headers,
      body: JSON.stringify({ refreshToken: user.refreshToken }),
    };
    // if (user && user.refreshToken && user.refreshToken.length > 10) {
    //   request.headers["x-refresh-token"] = `${user.refreshToken}`;

    // }
    let url = apiUrl + refreshTokenUrl;

    try {
      const response = await fetch(url, request);
      if (response.status < 300) {
        try {
          const d = await response.json();
          const u = getUser() || {};
          setUser({
            ...u,
            ...d,
          });
          //setUser(d);
        } catch (error) {
          console.log(error);
          throw error;
        }
      } else {
        const err = await response?.json();
        throw err;
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const getUrlAndRequest = (data: IRequestParams) => {
    const currentProject = getCurrentProjectLS();
    const currentFacility = getCurrentFacilityLS() || "";
    const headers: HeadersType = {
      projectId: currentProject,
      facilityId: currentFacility,
      Accept: "application/json",
      "Content-Type": "application/json",
      ...data.headers,
    };
    const request: IRequest = {
      method: data.method ? data.method.toUpperCase() : "GET",
      headers: headers,
    };

    if (data.multipart) {
      delete request.headers["Content-Type"];
    }
    const parameters = data.params || {};

    const paramsKeys = Object.keys(parameters);

    if (data.method && data.method.toUpperCase() !== "GET" && data.body) {
      request["body"] = data.multipart ? data.body : JSON.stringify(data.body);
    }
    const user = getUser();

    if (
      user &&
      user.accessToken &&
      user.accessToken.length > 10 &&
      !request.headers[authheader]
    ) {
      request.headers[authheader] = bearer
        ? `Bearer ${user.accessToken}`
        : user.accessToken;
    }
    let params = "";
    // if (data.queryString) {
    //   params = "?queryString=" + JSON.stringify(data.queryString);
    // }
    if (typeof data.currentPage !== "undefined") {
      const addChar = params ? "&" : "?";
      params += `${addChar}currentPage=${data.currentPage}`;
    }
    if (data.perPage) {
      const addChar = params ? "&" : "?";
      params += `${addChar}perPage=${data.perPage}`;
    }
    if (data.limit) {
      const addChar = params ? "&" : "?";
      params += `${addChar}limit=${data.limit}`;
    }
    if (data.skip) {
      const addChar = params ? "&" : "?";
      params += `${addChar}skip=${data.skip}`;
    }
    if (data.search) {
      const addChar = params ? "&" : "?";
      params += `${addChar}search=${data.search}`;
    }
    if (paramsKeys.length > 0) {
      paramsKeys.forEach((key, index) => {
        const addChar = params ? "&" : "?";
        params += `${addChar}${key}=${parameters[key]}`;
      });
    }
    let url = data.url + params;
    return { url, request };
  };

  return {
    sendRequest: send,
  };
}
export default createRequestService;
