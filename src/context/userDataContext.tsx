import React, { useState, createContext, useContext, useEffect } from "react";
import { getUser } from "../services/localStorage";
import { IUser } from "../types/user";
import { GlobalStateContext } from "./GlobalStateProvider";

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
  const [userData] = useState(defaultState.userData);

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
