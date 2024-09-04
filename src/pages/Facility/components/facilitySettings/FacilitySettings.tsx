import React, { useEffect, useState } from "react";

import styles from "./FacilitySettings.module.css";
import { IEditField, IOptionsListItem } from "../../../../types/appdata";
import { ICompany } from "../../../../types/groupCompanies";
import { servicesPackage } from "../../../../services/servicesPackage";

import EditFields from "../../../../components/editFields/EditFields";
import {
  getFieldsFromEnvironmentValues,
  getItemFromEnvironmentValues,
} from "../../../../utils/getFieldsFromSettings";

const FacilitySettings = ({
  initSettingData,
  initDataCompany,
  company,
}: {
  initSettingData: IOptionsListItem;
  initDataCompany: IOptionsListItem;
  company: ICompany | null;
}) => {
  const { collectionName: companyCollection } = initDataCompany;
  const { collectionName: settingCollection } = initSettingData;
  const companyService = servicesPackage[companyCollection];
  const settingService = servicesPackage[settingCollection];
  const [settingsFields, setSettingsFields] = useState<
    (IEditField & { description: string })[]
  >([]);
  const [companyFields, setCompanyFields] = useState<
    (IEditField & { description: string })[]
  >([
    {
      name: "name",
      label: "Facility Name",
      type: "text",
      placeholder: "Enter Facility name",
      required: true,
      description: "This is Facility name",
    },
  ]);
  const [dangerFields] = useState<(IEditField & { description: string })[]>([
    {
      name: "name",
      label: "Delete this company",
      type: "deleteButton",
      placeholder: "Delete company",

      description: "This action can't be undone",
    },
  ]);
  const [currentSettingsItem, setCurrentSettingsItem] = useState<any>(null);
  useEffect(() => {
    settingService
      ?.getAll({ params: { facilityId: company?.id } })
      .then((res) => {
        const settings = {
          id: company?.id,
          items: res,
        };
        setCurrentSettingsItem(getItemFromEnvironmentValues(settings));
        setSettingsFields(getFieldsFromEnvironmentValues(settings));
      });
  }, [company]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className="body-l-medium">Settings for {company?.name}</span>
        <span className="body-m-regular text-secondary ">
          Manage your company settings and admins.
        </span>
      </div>

      <div className={styles.card}>
        {company && company.id && (
          <EditFields
            fields={companyFields}
            currentItem={company}
            itemService={companyService}
            title={"General"}
          />
        )}
      </div>
      <div className={styles.card}>
        {currentSettingsItem && (
          <EditFields
            fields={settingsFields}
            currentItem={currentSettingsItem}
            itemService={settingService}
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
        )}
      </div>
      <div className={styles.card}>
        <EditFields
          fields={dangerFields}
          currentItem={company}
          itemService={companyService}
          title={"Danger zone"}
          initData={initDataCompany}
        />
      </div>
    </div>
  );
};

export default FacilitySettings;
