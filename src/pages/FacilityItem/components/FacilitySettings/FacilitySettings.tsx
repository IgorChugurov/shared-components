import React, { useEffect, useState } from "react";

import "./FacilitySettings.css";
import { IEditField, IOptionsListItem } from "../../../../types/appdata";
import { servicesPackage } from "../../../../services/servicesPackage";
import EditFields from "../../../../components/editFields/EditFields";
import {
  getFieldsFromEnvironmentValues,
  getItemFromEnvironmentValues,
} from "../../../../utils/getFieldsFromSettings";

const FacilitySettings = ({
  initDataSettings,
  facility,
}: {
  initDataSettings: IOptionsListItem;
  facility: any;
}) => {
  const facilityId = facility?.id || "";
  //console.log("facilityId", facilityId);
  const { collectionName: collectionNameSettings } = initDataSettings;
  const settingsService = servicesPackage[collectionNameSettings];
  const [settingsFields, setSettingsFields] = useState<IEditField[]>([]);
  const [currentSettingsItem, setCurrentSettingsItem] = useState<any>(null);
  useEffect(() => {
    settingsService?.getAll({ params: { facilityId } }).then((res) => {
      const settings = {
        id: facilityId,
        items: res,
      };
      setCurrentSettingsItem(getItemFromEnvironmentValues(settings));
      setSettingsFields(getFieldsFromEnvironmentValues(settings));
    });
  }, [facility]);

  return (
    <div className="facilitySettings-container">
      <div className="facilitySettings-header">
        <span className="body-l-medium">Settings for {facility?.name}</span>
        <span className="body-m-regular text-secondary ">
          Manage your ficility settings.
        </span>
      </div>

      <div className="facilitySettings-card">
        <EditFields
          fields={settingsFields}
          currentItem={currentSettingsItem}
          itemService={settingsService}
          title={"Features"}
          transformData={(data: any) => {
            delete data.id;
            return {
              items: Object.entries(data).map(([key, value]) => ({
                key,
                value,
              })),
            };
          }}
        />
      </div>
    </div>
  );
};

export default FacilitySettings;
