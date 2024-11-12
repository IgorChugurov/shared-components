import React, { useContext, useEffect, useState } from "react";
import { IEditField, IOptionsListItem } from "../../types/appdata";
import { ApiService, servicesPackage } from "../../services/servicesPackage";
import { GlobalStateContext } from "../../context/GlobalStateProvider";
import { IEntity } from "../../types/entity";
import {
  getFieldsWithProjectSettings,
  getItemForEdit,
} from "../../utils/getItemForEdit";
import { getInitDataItem } from "../../utils/createInitDataForEntity";
import { getAnyEntity } from "../../utils/createUpdateDeleteAnyEntity";
import CreateItemForEntity from "../../components/CreateItemForEntity/CreateItemForEntity";

const EntityNewItem = ({
  initDataEntity,
  initDataFields,
}: {
  initDataEntity: IOptionsListItem;
  initDataFields: IOptionsListItem;
}) => {
  const { collectionName: entityCollectionName } = initDataEntity;
  const { collectionName: fieldsCollectionName } = initDataFields;
  const entityService = servicesPackage[entityCollectionName];
  const settingService = servicesPackage["projectSettings"];

  const fieldsService = servicesPackage[fieldsCollectionName];
  const { changeRouteData, routeData } = useContext(GlobalStateContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchState, setSearchState] = useState<string>("");
  const entityId = location.pathname.split("/")[4];
  const [itemEntity, setItemEntity] = useState<IEntity | null>(null);
  const [itemFromServerForEdit, setItemFromServerForEdit] = useState<any>(null);

  const [allFieldsForEntity, setAllFieldsForEntity] = useState<IEditField[]>(
    []
  );

  const [forEditFields, setForEditFields] = useState<any>([]);
  const [initDataItem, setInitDataItem] = useState<IOptionsListItem>(
    {} as IOptionsListItem
  );

  const [projectSettings, setProjectSettings] = useState<any>({
    languages: ["en", "de", "fr", "es", "it", "ru"],
    defaultLang: "en",
    emails: "",
    emailNotification: true,
  });

  // get entity  , fields and settings for this project
  useEffect(() => {
    // here we get get entity  , fields and settings for this project
    if (entityService && fieldsService) {
      //   changeRouteData({ entity: null });
      setLoading(true);
      getAnyEntity(entityId, entityService)
        .then((res) => {
          // get entity by id and set it to the state
          const entity: IEntity = res as unknown as IEntity;
          setLoading(false);
          //   changeRouteData({ entity: entity });
          setItemEntity(entity);
          //console.log(entity);
          if (entity) {
            // create service for items  this entity
            servicesPackage[entity.tableName] = new ApiService<any>(
              entity.url,
              `reloadItems${entity.tableName}`
            );
          }
        })
        .then(() => {
          const options = {
            params: { entityDefinitionId: entityId },
            headers: { entityDefinitionId: entityId },
          };
          return fieldsService.getAll(options);
        })
        .then((res: any) => {
          //console.log(res);
          // get all fields for this entity and add forCreatePage and forEditPage
          setAllFieldsForEntity(
            res.map((field: any) => {
              return {
                ...field,
                collectionName:
                  field.name === "type" ? "promptsType" : undefined,
              };
            })
          );
        })
        .then(() => {
          // get all settings for this project
          return settingService.getAll();
        })
        .then((res: any) => {
          setProjectSettings(res);
        })
        .catch((err: any) => {
          console.log(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, []);
  // then we create initData for entity item and set fields for edit based on project settings and fields for entity from server
  useEffect(() => {
    if (itemEntity && allFieldsForEntity) {
      const allFieldsWithLangs = getFieldsWithProjectSettings(
        allFieldsForEntity,
        projectSettings
      );
      const initData = getInitDataItem(itemEntity, allFieldsWithLangs);
      setForEditFields(allFieldsWithLangs);
      setInitDataItem(initData);
      const data = getItemForEdit(allFieldsForEntity, null, projectSettings);
      setItemFromServerForEdit(data);
    }
  }, [itemEntity, allFieldsForEntity, projectSettings]);

  // then we watch for currentItem and if it is changed we get item from server and set it for edit due to project settings

  return (
    <>
      {initDataItem.forEdit && itemFromServerForEdit && (
        <CreateItemForEntity
          initAllFields={forEditFields}
          dataForEditPage={initDataItem.forEdit}
          messages={{}}
          currentItem={itemFromServerForEdit}
          itemsService={servicesPackage[itemEntity?.tableName || ""]}
          parentEntityId={entityId}
        />
      )}
    </>
  );
};

export default EntityNewItem;
