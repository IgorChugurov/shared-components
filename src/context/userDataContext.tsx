import React, { useState, createContext, useContext, useEffect } from "react";
import { getUser } from "../services/localStorage";
import { IUser } from "../types/user";
import { GlobalStateContext } from "./GlobalStateProvider";
import { createLoginMessageHandler } from "requestwithrefreshtoken";
import Login from "../pages/Login/Login";

const INIT_USER: IUser | null = getUser();
const defaultState = {
  userData: INIT_USER,
};
interface IContext {
  userData: IUser | null;
}
interface Props {
  children: React.ReactNode;
}
export const UserDataContext = createContext<IContext>(defaultState);
export const UserDataContextProvider: React.FC<Props> = ({ children }) => {
  const [userData, setUserDataContenxt] = useState(defaultState.userData);
  const { LSPrefix } = useContext(GlobalStateContext);

  const { VITE_SSOSERVERURL: SSOSERVERURL } = import.meta.env;
  // lskey - prefix for the local storage key
  useEffect(() => {
    const handleLoginMessage = createLoginMessageHandler({
      lskey: `${LSPrefix}-user`,
      ssoserverurl: SSOSERVERURL,
      callback: (data: any) => {
        setUserDataContenxt(data.user);
        //setTimeout(() => (window.location.href = "/"), 100);
      },
    });
    window.addEventListener("message", handleLoginMessage, false);
    return () => {
      window.removeEventListener("message", handleLoginMessage);
    };
  }, []);

  return (
    <UserDataContext.Provider
      value={{
        userData,
      }}
    >
      {userData ? children : <Login />}
    </UserDataContext.Provider>
  );
};
