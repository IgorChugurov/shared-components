import { IAuthData, IInitalConfig, IOptionsListItem } from "../types/appdata";
import authConfig from "./authConfig.json";
import globalConfig from "./globalConfig.json";
import appGlobalStoreEnitiesList from "./globalStoreEnities.json";
import groups from "./groups.json";
import facilities from "./facilities.json";
import groupAdmins from "./groupAdmins.json";
import facilityAdmins from "./facilityAdmins.json";
import facilitySettings from "./facilitySettings.json";
import environments from "./environments.json";
import appAdmins from "./appAdmins.json";
import projectSettings from "./projectSettings.json";
import entities from "./entities.json";
import fields from "./fields.json";
import projects from "./projects.json";

export const initConfig: IInitalConfig = {
  ...globalConfig,
  AuthData: authConfig as IAuthData,
  appGlobalStoreEnitiesList: appGlobalStoreEnitiesList,
  EntitiesForListAndServicesPackageAndEditPage: [
    groups,
    facilities,
    groupAdmins,
    facilityAdmins,
    facilitySettings,
    environments,
    appAdmins,
    projectSettings,
    entities,
    fields,
    projects,
  ] as IOptionsListItem[],
};

export const LSPrefix = initConfig.LSPrefix;
