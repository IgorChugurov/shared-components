import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { IEditField, IOptionsListItem } from "../../types/appdata";
import { ApiService, servicesPackage } from "../../services/servicesPackage";
import { GlobalStateContext } from "../../context/GlobalStateProvider";
import { IEntity } from "../../types/entity";
import {
  getFieldsWithProjectSettings,
  getItemForEdit,
} from "../../utils/getItemForEdit";
import { getInitDataForDatasetFromEntity } from "../../utils/createInitDataForEntity";
import { getAnyEntity } from "../../utils/createUpdateDeleteAnyEntity";
import CreateUpdateDeleteAnyEntityWithFields from "../../shared-components/components/CreateUpdateDeleteAnyEntityWithFields/CreateUpdateDeleteAnyEntityWithFields";
import { sendRequest } from "../../services/request";
import { processEntityFields } from "../../shared-components/utils/processEntityFields";
import { sendMessage } from "../../utils";

// Types for managing entity data and processed results
interface EntityState {
  entity: IEntity | null;
  fields: IEditField[];
  settings: any;
}

interface ProcessedData {
  forEditFields: IEditField[];
  initDataDataset: IOptionsListItem;
  entityDatasetItem: any;
}

const DatasetNewItem: React.FC<{
  initDataEntity: IOptionsListItem;
  initDataFields: IOptionsListItem;
}> = React.memo(
  ({ initDataEntity, initDataFields }) => {
    const { entitiesList, renewData, changeRouteData, routeData } =
      useContext(GlobalStateContext);
    const contextValues = useMemo(
      () => ({
        entitiesList,
        renewData,
        changeRouteData,
        routeData,
      }),
      [entitiesList, renewData, changeRouteData, routeData]
    );
    const { collectionName: entityCollectionName } = initDataEntity;
    const { collectionName: fieldsCollectionName } = initDataFields;

    const services = useMemo(
      () => ({
        entityService: servicesPackage[entityCollectionName],
        settingService: servicesPackage["projectSettings"],
        fieldsService: servicesPackage[fieldsCollectionName],
      }),
      [entityCollectionName, fieldsCollectionName]
    );

    // Получаем последний сегмент URL
    const urlSegments = useMemo(() => location.pathname.split("/"), []);
    const lastSegment = useMemo(
      () => urlSegments[urlSegments.length - 1],
      [urlSegments]
    );
    const entityId = useMemo(() => urlSegments[4], [urlSegments]);
    const isNewItem = useMemo(() => lastSegment === "newitem", [lastSegment]);

    // Create parent URL by removing last segment
    const parentUrl = useMemo(() => {
      const segments = [...urlSegments];
      segments.pop(); // Remove last segment
      return segments.join("/");
    }, [urlSegments]);

    // Добавляем функцию для получения данных item
    const fetchDatasetItem = async (
      itemId: string,
      itemService: any
    ): Promise<any> => {
      if (isNewItem) return {};
      return await getAnyEntity(itemId, itemService);
    };

    // Main state for entity data
    const [entityState, setEntityState] = useState<EntityState>({
      entity: null,
      fields: [],
      settings: null,
    });
    // State for processed and ready-to-use data
    const [processedData, setProcessedData] = useState<ProcessedData>({
      forEditFields: [],
      initDataDataset: {} as IOptionsListItem,
      entityDatasetItem: null,
    });

    useEffect(() => {
      if (!services.entityService || !services.fieldsService) return;
      const fetchData = async () => {
        try {
          sendMessage("showParange");
          const [entity, settings, fields] = await Promise.all([
            fetchEntityData(entityId, services.entityService),
            fetchSettingsData(services.settingService),
            fetchEntityFields(services.fieldsService, entityId),
          ]);

          // Создаем сервис для работы с данными entity
          let itemData = {};
          if (!isNewItem && entity) {
            const datasetService = servicesPackage[entity.tableName];
            if (datasetService) {
              itemData = await fetchDatasetItem(lastSegment, datasetService);
            }
          }

          // Создаем функцию для безопасного обновления полей
          const updateField = (newField: IEditField) => {
            setEntityState((prev) => ({
              ...prev,
              fields: prev.fields.map((field) => {
                //console.log("newField", newField);
                return field.name === newField.name ? newField : field;
              }),
            }));
          };

          setEntityState({
            entity,
            fields,
            settings,
          });
          processEntityFields({
            fields,
            entitiesList: contextValues.entitiesList,
            renewData: contextValues.renewData,
            entityService: services.entityService,
            updateField,
            sendRequest,
          });

          if (entity && fields.length && settings) {
            const allFieldsWithLangs = getFieldsWithProjectSettings(
              fields,
              settings
            );
            const initData = getInitDataForDatasetFromEntity(
              entity,
              allFieldsWithLangs
            );
            const data = getItemForEdit(fields, itemData, settings);

            setProcessedData({
              forEditFields: allFieldsWithLangs,
              initDataDataset: initData,
              entityDatasetItem: data,
            });
          }
        } catch (error) {
          console.error(error);
        } finally {
          sendMessage("hideParange");
        }
      };

      fetchData();
    }, [services, entityId]);

    const timeoutRef = useRef<NodeJS.Timeout>();
    useEffect(() => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        const allFieldsWithLangs = getFieldsWithProjectSettings(
          entityState.fields,
          entityState.settings
        );
        setProcessedData((prev) => {
          return {
            ...prev,
            forEditFields: allFieldsWithLangs,
          };
        });
      }, 500);
    }, [entityState.fields]);

    // Process data when all pieces are available

    const renderContent = useMemo(() => {
      const { forEditFields, initDataDataset, entityDatasetItem } =
        processedData;

      if (!initDataDataset.forEdit || !entityDatasetItem) return null;

      return (
        <CreateUpdateDeleteAnyEntityWithFields
          initAllFields={forEditFields}
          pageTitle={
            entityDatasetItem?.id
              ? initDataDataset.forEdit.title[1] // Edit mode title
              : initDataDataset.forEdit.title[0] // Create mode title
          }
          buttonTitle={
            entityDatasetItem?.id
              ? initDataDataset.forEdit.buttonText?.update || "Update"
              : initDataDataset.forEdit.buttonText?.create || "Create"
          }
          messages={initDataDataset.forList?.messages || {}}
          currentItem={entityDatasetItem}
          itemsService={servicesPackage[entityState.entity?.tableName || ""]}
          parentUrl={parentUrl}
        />
      );
    }, [processedData, entityState.entity?.tableName]);

    return <>{renderContent}</>;
  },
  (prevProps, nextProps) => {
    // Only rerender if init data changes
    return (
      prevProps.initDataEntity === nextProps.initDataEntity &&
      prevProps.initDataFields === nextProps.initDataFields
    );
  }
);

export default DatasetNewItem;

/**
 * Fetches entity data from the server and sets up service for entity operations
 * @param entityId - ID of the entity to fetch
 * @param entityService - Service for entity operations
 * @returns Fetched entity data
 */
const fetchEntityData = async (
  entityId: string,
  entityService: any
): Promise<IEntity> => {
  const entity = await getAnyEntity(entityId, entityService);
  if (entity) {
    // Create API service for entity table operations
    servicesPackage[entity.tableName] = new ApiService(entity.url, {
      update: `reloadItems${entity.tableName}`,
      create: `reloadItems${entity.tableName}`,
      delete: `reloadItems${entity.tableName}`,
    });
  }
  return entity;
};

/**
 * Fetches project settings from the server
 * @param settingService - Service for settings operations
 * @returns Project settings data
 */
const fetchSettingsData = async (settingService: any): Promise<any> => {
  return settingService.getAll();
};
const fetchEntityFields = async (
  fieldsService: any,
  entityId: string
): Promise<any> => {
  const options = {
    params: { entityDefinitionId: entityId },
    headers: { entityDefinitionId: entityId },
  };

  // Get fields configuration from server
  return await fieldsService.getAll(options);
};
