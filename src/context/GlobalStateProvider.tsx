import React, {
  createContext,
  Dispatch,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import { AppState, Action } from "../types/types";
import { reducer } from "./stateReducer";
import { setError } from "../utils";
import Resultoutput from "../components/resultoutput/Resultuotput";
import ParangaForViewport from "../components/parangaForViewport/ParangaForViewport";
import { UserDataContextProvider } from "./userDataContext";
import {
  getCurrentProjectLS,
  getDarkModeLS,
  getUser,
  setCurrentProjectLS,
  setDarkModeLS,
} from "../services/localStorage";

import { initConfig } from "../config/initConfig";
import appGlobalStoreEnitiesList from "../config/globalStoreEnities.json";

import { createTheme, PaletteMode, ThemeProvider } from "@mui/material";
import { DataItem, IAuthData } from "../types/appdata";
import { sendRequest } from "../services/request";

const initDarkMode = getDarkModeLS() as PaletteMode;
const initCurrentProject = getCurrentProjectLS();
setModeClassForBody(initDarkMode);
const initState = {
  entitiesList: {},
  dispatch: () => {},
  renewData: () => {},
  darkMode: initDarkMode,
  toggleDarkMode: () => {},
  AuthData: {} as IAuthData,
  TITLE: "",
  VERSION: "",

  STUDIA: "",
  LSPrefix: "",
  routeData: {},
  changeRouteData: () => {},
  currentProject: initCurrentProject,
  setCurrentProject: () => {},
};

export const GlobalStateContext = createContext<{
  entitiesList: AppState;
  dispatch: Dispatch<Action>;
  renewData: (name: string) => any;
  darkMode: PaletteMode;
  toggleDarkMode: () => void;
  AuthData: IAuthData;
  TITLE: string;
  VERSION: string;

  STUDIA: string;
  LSPrefix: string;
  routeData: any;
  changeRouteData: (d: any) => void;
  currentProject: string;
  setCurrentProject: (d: string) => void;
}>(initState);

interface StateProviderProps {
  children: React.ReactNode;
}

export const GlobalStateProvider: React.FC<StateProviderProps> = ({
  children,
}) => {
  const initialState = useMemo(() => {
    return appGlobalStoreEnitiesList.reduce((acc: AppState, item: DataItem) => {
      if (item.collection) {
        acc[item.collection] = { list: [], loading: false };
      }

      return acc;
    }, {});
  }, []);

  const mapOfUrl: {
    [key: string]: {
      apiUrl: string;
      title: string;
      collections: { filterField: string; value: string }[];
    };
  } = useMemo(() => {
    return appGlobalStoreEnitiesList.reduce(
      (acc: { [key: string]: any }, item: DataItem) => {
        acc[item.collection] = { ...item };
        return acc;
      },
      {}
    );
  }, []);
  //console.log(mapOfUrl);
  const [darkMode, setDarkMode] = useState<PaletteMode>(initState.darkMode);
  const [TITLE] = useState(initConfig.TITLE);
  const [VERSION] = useState(initConfig.VERSION);
  const [LSPrefix] = useState(initConfig.LSPrefix);
  const [AuthData] = useState(initConfig.AuthData);
  const [currentProject, setCurrentProject] = useState(
    initState.currentProject
  );
  // this only for listItems
  const [entitiesList, dispatch] = useReducer(reducer, initialState);

  // for store data for each route in the app to use this data in the components
  const [routeData, changeRouteData] = useReducer(
    (
      entitiesList: { [key: string]: any },
      newState: { [key: string]: any }
    ) => ({
      ...entitiesList,
      ...newState,
    }),
    initState.routeData
  );

  const toggleDarkMode = () => {
    const mode = darkMode === "dark" ? "light" : "dark";
    setModeClassForBody(mode);
    setDarkMode(mode);
    setDarkModeLS(mode);
  };

  const renewData = async (name: string) => {
    if (!mapOfUrl[name]) {
      return;
    }
    const user = getUser();
    if (!user) {
      return;
    }
    dispatch({ type: "SET_LOADING", payload: { name, loading: true } });
    const req = {
      url: `${mapOfUrl[name].apiUrl}`,
      method: "GET",
    };
    return sendRequest(req)
      .then((data: any) => {
        dispatch({
          type: "SET_DATA",
          payload: { name, data: data && data.items ? data.items : data },
        });
      })
      .then(async () => {
        await new Promise((resolve) => setTimeout(resolve, 100));
      })
      .catch((error: any) => {
        // const data: any =
        //   name === "projectSettings"
        //     ? {
        //         languages: ["en", "de"],
        //         defaultLang: "en",
        //         emails: "",
        //         emailNotification: true,
        //       }
        //     : [];
        if (name === "entityValues") {
          if (mapOfUrl[name].collections && mapOfUrl[name].collections.length) {
            mapOfUrl[name].collections.forEach((collection) => {
              dispatch({
                type: "SET_DATA",
                payload: {
                  name: collection.value,
                  data: [
                    { id: "1", name: "Note" },
                    { id: "2", name: "Letter" },
                  ],
                },
              });
            });
          }

          // dispatch({
          //   type: "SET_DATA",
          //   payload: {
          //     name,
          //     data: [
          //       { id: "1", name: "Note" },
          //       { id: "2", name: "Letter" },
          //     ],
          //   },
          // });
        } else {
          dispatch({ type: "SET_DATA", payload: { name, data: [] } });
        }

        setTimeout(() => {
          setError("");
        }, 5000);
        console.log(error.message);
      });
  };

  const theme = useMemo(() => {
    return createTheme({
      palette: { mode: darkMode || "light" },
    });
  }, [darkMode]);

  const dependencies: { [key: string]: string[] } = {
    projectSettings: ["projects"], // Load entities after projects
  };

  const loadDataWithDependencies = async () => {
    const loadedEntities = new Set<string>();
    const loadEntity = async (entity: string) => {
      if (loadedEntities.has(entity)) return;
      const entityDependencies = dependencies[entity] || [];
      for (const dependency of entityDependencies) {
        if (!loadedEntities.has(dependency)) {
          await loadEntity(dependency);
        }
      }

      await renewData(entity);
      loadedEntities.add(entity);
    };

    for (const item of appGlobalStoreEnitiesList) {
      if (item.apiUrl) {
        await loadEntity(item.collection);
      } else if (item.items) {
        const name = item.collection;
        dispatch({
          type: "SET_DATA",
          payload: { name, data: item.items },
        });
      }
    }
  };

  useEffect(() => {
    const eventListeners: Array<() => void> = [];
    appGlobalStoreEnitiesList.forEach((item: DataItem) => {
      const eventListener = () => renewData(item.collection);
      if (item.reloadEventTitle) {
        window.addEventListener(item.reloadEventTitle, eventListener);
        eventListeners.push(() => {
          if (item.reloadEventTitle) {
            window.removeEventListener(item.reloadEventTitle, eventListener);
          }
        });
      }
    });
    loadDataWithDependencies();
    return () => {
      eventListeners.forEach((removeListener) => removeListener());
    };
  }, []);

  useEffect(() => {
    if (
      !entitiesList["projects"]?.loading &&
      entitiesList["projects"]?.list.length > 0
    ) {
      if (
        !initState.currentProject ||
        !entitiesList["projects"]?.list.find(
          (p: any) => p.id === initState.currentProject
        )
      ) {
        setCurrentProject(entitiesList["projects"]?.list[0].id);
      }
    }
  }, [entitiesList["projects"]?.loading]);
  useEffect(() => {
    if (currentProject) {
      setCurrentProjectLS(currentProject);
    }
  }, [currentProject]);
  //console.log(entitiesList);
  return (
    <GlobalStateContext.Provider
      value={{
        entitiesList,
        dispatch,
        renewData,
        darkMode,
        toggleDarkMode,
        AuthData,
        TITLE,
        VERSION,
        routeData,
        changeRouteData,
        STUDIA: initConfig.STUDIA,
        LSPrefix,
        currentProject,
        setCurrentProject,
      }}
    >
      <ThemeProvider theme={theme}>
        <UserDataContextProvider>{children}</UserDataContextProvider>
        <Resultoutput />
        <ParangaForViewport />
      </ThemeProvider>
    </GlobalStateContext.Provider>
  );
};

function setModeClassForBody(mode: string) {
  const bodyClassList = document.body.classList;
  // Remove both potential classes to avoid conflicts
  bodyClassList.remove("light", "dark");
  // Add the specified mode as a class
  bodyClassList.add(mode);
}
