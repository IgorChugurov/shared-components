import { NavigateFunction } from "react-router-dom";

interface ServiceConfig {
  lskey: string;

  refreshTokenUrl: string;
  apiUrl: string;

  tokenField?: string;
  navigate?: NavigateFunction; // Добавляем navigate в конфиг

  defaultHeaders?: () => { [key: string]: string };
}

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
  signal?: AbortSignal;
}
type HeadersType = Record<string, string>;
interface IRequest {
  method: string;
  body?: any;
  headers: HeadersType;
  signal?: AbortSignal;
}
function createRequestService({
  lskey,
  refreshTokenUrl,
  apiUrl,

  tokenField = "accessToken",
  navigate, // Получаем navigate из конфига

  defaultHeaders,
}: ServiceConfig) {
  const handleError = (err: any) => {
    if (err.name === "AbortError") {
      throw err;
    }

    if (navigate) {
      // if (err?.statusCode === 404 || err?.statusCode === 400) {
      //   navigate("/404");
      //   return;
      // }
      if (err?.statusCode === 401) {
        navigate("/unauthorized");
        return;
      }
    }

    throw err;
  };

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

  const send = async (data: IRequestParams) => {
    //const user = getUser();

    const { url, request } = getUrlAndRequest(data);

    const uri = apiUrl + url;

    try {
      const response = await fetch(uri, request);
      if (data.signal?.aborted) {
        throw new DOMException("Request aborted", "AbortError");
      }
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
      handleError(err);
      // if (err && err.statusCode && (err.statusCode === 400 || err.statusCode === 404)) {
      //   navigate("/404");
      // }
      // if (err && err.statusCode && (err.statusCode === 400 || err.statusCode === 404)) {
      //   navigate("/404");
      // }
      // if (err && err.statusCode && err.statusCode === 401) {
      //   navigate("/unauthorized");
      // }
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
            [tokenField]: d[tokenField],
            refreshToken: d.refreshToken,
            email: d.email,
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
    const headers: HeadersType = {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...data.headers,
    };
    const request: IRequest = {
      method: data.method ? data.method.toUpperCase() : "GET",
      headers: headers,
      signal: data.signal,
    };

    if (data.multipart) {
      delete request.headers["Content-Type"];
    }
    const parameters = data.params || {};

    const paramsKeys = Object.keys(parameters);

    if (data.method && data.method.toUpperCase() !== "GET" && data.body) {
      request["body"] = data.multipart ? data.body : JSON.stringify(data.body);
    }
    //const user = getUser();

    // if (user && user[tokenField] && user[tokenField].length > 10 && !request.headers[authheader]) {
    //   request.headers[authheader] = bearer ? `Bearer ${user[tokenField]}` : user[tokenField];
    // }

    if (defaultHeaders) {
      const headers = defaultHeaders();
      Object.keys(headers).forEach((key) => {
        request.headers[key] = headers[key];
      });
    }
    //request.headers["projectid"] = PROJECT_ID || "";
    // console.log(tokenField, user);
    // console.log(request.headers[authheader]);
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
    setNavigate: (newNavigate: NavigateFunction) => {
      navigate = newNavigate;
    },
  };
}
export default createRequestService;
