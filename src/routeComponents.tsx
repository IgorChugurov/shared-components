import initDataCompanySettings from "./config/facilitySettings.json";
import initDataCompanyAdmins from "./config/facilityAdmins.json";
import initDataEntity from "./config/entities.json";
import initDataFields from "./config/fields.json";
import initDataFacilities from "./config/facilities.json";
import FacilitiesList from "./pages/Facilities/FicilitiesList.tsx";
import FacilityItem from "./pages/FacilityItem/FacilityItem.tsx";
import EntityItem from "./pages/EntityItem/EntityItem.tsx";
import EntityDatasetNewOrEditItem from "./pages/EntityDatasetNewOrEditItem/EntityDatasetNewOrEditItem.tsx";

export const Facilities = () => (
  <FacilitiesList initDataFacilities={initDataFacilities} />
);
export const Entities = () => (
  <FacilityItem
    initDataFacilities={initDataFacilities}
    initDataEntity={initDataEntity}
    initDataFields={initDataFields}
    initDataUsers={initDataCompanyAdmins}
    initDataSettings={initDataCompanySettings}
    initTab={0}
  />
);
export const Settings = () => (
  <FacilityItem
    initDataFacilities={initDataFacilities}
    initDataEntity={initDataEntity}
    initDataFields={initDataFields}
    initDataUsers={initDataCompanyAdmins}
    initDataSettings={initDataCompanySettings}
    initTab={1}
  />
);
export const Users = () => (
  <FacilityItem
    initDataFacilities={initDataFacilities}
    initDataEntity={initDataEntity}
    initDataFields={initDataFields}
    initDataUsers={initDataCompanyAdmins}
    initDataSettings={initDataCompanySettings}
    initTab={2}
  />
);
export const Entity = () => (
  <EntityItem initDataEntity={initDataEntity} initDataFields={initDataFields} />
);
export const NewOrEditDatasetItem = () => (
  <EntityDatasetNewOrEditItem
    initDataEntity={initDataEntity}
    initDataFields={initDataFields}
  />
);
