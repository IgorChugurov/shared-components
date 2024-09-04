import React, { useContext, useEffect, useState } from "react";

import styles from "./ProjectSettings.module.css";
import { IEditField, IOptionsListItem } from "../../../../types/appdata";
import { GlobalStateContext } from "../../../../context/GlobalStateProvider";
import { servicesPackage } from "../../../../services/servicesPackage";

import EditFields from "../../../../components/editFields/EditFields";
import {
  getFieldsFromEnvironmentValues,
  getItemFromEnvironmentValues,
} from "../../../../utils/getFieldsFromSettings";

const ProjectSettings = ({
  initDataProjects,
  initSettingData,
}: {
  initDataProjects: IOptionsListItem;
  initSettingData: IOptionsListItem;
}) => {
  const { currentProject, entitiesList } = useContext(GlobalStateContext);
  const [project, setProject] = useState<any>({});
  const { collectionName: projectCollection } = initDataProjects;
  const { collectionName: settingCollection } = initSettingData;
  const projectService = servicesPackage[projectCollection];
  const settingService = servicesPackage[settingCollection];
  const [settingsFields, setSettingsFields] = useState<
    (IEditField & { description: string })[]
  >([]);
  const [projectFields, setProjectFields] = useState<
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

  const [currentSettingsItem, setCurrentSettingsItem] = useState<any>(null);
  useEffect(() => {
    settingService?.getAll().then((res) => {
      const settings = {
        id: currentProject,
        items: res,
      };
      setCurrentSettingsItem(getItemFromEnvironmentValues(settings));
      setSettingsFields(getFieldsFromEnvironmentValues(settings));
    });
  }, [currentProject]);

  useEffect(() => {
    const p =
      (entitiesList["projects"] &&
        entitiesList["projects"].list.find(
          (p: any) => p.id === currentProject
        )) ||
      {};
    setProject(p);
  }, [entitiesList["projects"]?.list]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className="body-l-medium">Settings for {project?.name}</span>
        <span className="body-m-regular text-secondary ">
          Manage your project settings.
        </span>
      </div>

      <div className={styles.card}>
        {project && project.id && (
          <EditFields
            fields={projectFields}
            currentItem={project}
            itemService={projectService}
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
    </div>
  );
};

export default ProjectSettings;
