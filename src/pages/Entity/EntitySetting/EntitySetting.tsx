import React, { useState } from "react";
import { IEditField, IOptionsListItem } from "../../../types/appdata";
import { servicesPackage } from "../../../services/servicesPackage";
import "./EntitySetting.css";
import { IEntity } from "../../../types/entity";
import EditFields from "../../../components/editFields/EditFields";

const Entity = ({
  initDataEntity,
  entity,
}: {
  initDataEntity: IOptionsListItem;
  entity: IEntity | null;
}) => {
  const { collectionName: entityCollection, forEdit } = initDataEntity;
  const entityService = servicesPackage[entityCollection];
  const { sections } = forEdit;
  const [entityFields, setEntityFields] = useState<IEditField[]>(
    sections[0].fields
  );
  const [dangerFields] = useState<(IEditField & { description: string })[]>([
    {
      name: "name",
      label: "Delete this entity",
      type: "deleteButton",
      placeholder: "Delete Entity",

      description: "This action can't be undone",
    },
  ]);

  return (
    <div className="entity-setting-container">
      <div className="entity-setting-header">
        <span className="body-l-medium">Settings for {entity?.name}</span>
        <span className="body-m-regular text-secondary ">
          Manage your entity settings.
        </span>
      </div>

      <div className="entity-setting-card">
        {entity && entity.id && (
          <EditFields
            fields={entityFields}
            currentItem={entity}
            itemService={entityService}
            title={"General"}
          />
        )}
      </div>

      <div className="entity-setting-card">
        <EditFields
          fields={dangerFields}
          currentItem={entity}
          itemService={entityService}
          title={"Danger zone"}
          initData={initDataEntity}
        />
      </div>
    </div>
  );
};

export default Entity;
