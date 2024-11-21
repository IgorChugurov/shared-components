/**
 * This component is a page for a specific entity. It displays a list of items of that entity and allows the user to create, edit, and delete items.
 */
import React, { useContext, useEffect, useState } from "react";
import { IEditField, IOptionsListItem } from "../../types/appdata";
import { servicesPackage, ApiService } from "../../services/servicesPackage";
import { GlobalStateContext } from "../../context/GlobalStateProvider";
import { getAnyEntity } from "../../utils/createUpdateDeleteAnyEntity";
import { IEntity } from "../../types/entity";
import SearchInputSimple from "../../components/searchInput/SearchInputSimple";
import ListsItemsInTab from "../../components/listItemsInTab/ListItemsInTab";
import { Icon_add } from "../../components/icons/Icons";
import "./EntityItem.css";
import CreateItem from "../../components/createItem/CreateItem";
import { getItemForEdit } from "../../utils";
import { getFieldsWithProjectSettings } from "../../utils/getItemForEdit";

import { Outlet, useNavigate } from "react-router-dom";
import { getInitDataForDatasetFromEntity } from "../../utils/createInitDataForEntity";

const EntityItem = ({
  initDataEntity,
  initDataFields,
}: {
  initDataEntity: IOptionsListItem;
  initDataFields: IOptionsListItem;
}) => {
  const navigate = useNavigate();
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
  const [modalCreateOpen, setModalCreateOpen] = useState(false);

  const [placeholder, setPlaceholder] = useState<string>("Search ...");
  const [buttonTitle, setButtonTitle] = useState<string>("Create new item");

  const [initDataItem, setInitDataItem] = useState<IOptionsListItem>(
    {} as IOptionsListItem
  );

  const [currentItem, setCurrentItem] = useState<any>(null);
  const [projectSettings, setProjectSettings] = useState<any>(null);

  // const [projectSettings, setProjectSettings] = useState<any>({
  //   languages: ["en", "de", "fr", "es", "it", "ru"],
  //   defaultLang: "en",
  //   emails: "",
  //   emailNotification: true,
  // });

  const pathArr = location.pathname.split("/");
  const chRNum = 5; //document.getElementById("templates-root") ? 2 : 4;
  // console.log(
  //   "childRoute entity",
  //   pathArr.length,
  //   chRNum,
  //   pathArr.length > chRNum
  // );
  const childRoute = pathArr.length > chRNum;

  const createNewItem = () => {
    setItemFromServerForEdit(null);
    setCurrentItem(null);
    setModalCreateOpen(true);
  };

  // get entity  , fields and settings for this project
  useEffect(() => {
    // here we get get entity  , fields and settings for this project
    if (entityService && fieldsService) {
      changeRouteData({ entity: null });
      setLoading(true);
      getAnyEntity(entityId, entityService)
        .then((res) => {
          // get entity by id and set it to the state
          const entity: IEntity = res as unknown as IEntity;
          setLoading(false);
          changeRouteData({ entity: entity });
          setItemEntity(entity);
          setButtonTitle(`Create new ${entity.name.toLowerCase()}`);
          setPlaceholder(`Search for ${entity.name.toLowerCase()}`);
          //console.log(entity);
          if (
            entity &&
            entity.tableName &&
            !servicesPackage[entity.tableName]
          ) {
            // create service for items  this entity
            servicesPackage[entity.tableName] = new ApiService<any>(
              entity.url,
              {
                update: `reloadItems${entity.tableName}`,
                create: `reloadItems${entity.tableName}`,
                delete: `reloadItems${entity.tableName}`,
              }
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
          // get all fields for this entity and add forCreatePage and forEditPage
          setAllFieldsForEntity(res);
        })
        .then(() => {
          // get all settings for this project
          return settingService.getAll();
        })
        .then((res) => {
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
    if (itemEntity && allFieldsForEntity.length > 0 && projectSettings) {
      const allFieldsWithLangs = getFieldsWithProjectSettings(
        allFieldsForEntity,
        projectSettings
      );
      const initData = getInitDataForDatasetFromEntity(
        itemEntity,
        allFieldsWithLangs
      );
      setForEditFields(allFieldsWithLangs);
      setInitDataItem(initData);
    }
  }, [itemEntity, allFieldsForEntity, projectSettings]);

  // then we watch for currentItem and if it is changed we get item from server and set it for edit due to project settings

  useEffect(() => {
    const itemsService = servicesPackage[itemEntity?.tableName || ""];
    if (currentItem && currentItem.id) {
      getAnyEntity(currentItem.id, itemsService).then((res: any) => {
        const data = getItemForEdit(allFieldsForEntity, res, projectSettings);
        setItemFromServerForEdit(data);
      });
    } else {
      const data = getItemForEdit(allFieldsForEntity, null, projectSettings);
      setItemFromServerForEdit(data);
    }
  }, [currentItem]);

  return (
    <React.Fragment>
      {/* {modalCreateOpen && (
        <CreateItem
          initAllFields={forEditFields}
          dataForEditPage={initDataItem.forEdit}
          messages={{}}
          currentItem={itemFromServerForEdit}
          openModal={modalCreateOpen}
          handleCloseModal={() => setModalCreateOpen(false)}
          setOpenModal={setModalCreateOpen}
          itemsService={servicesPackage[itemEntity?.tableName || ""]}
          parentEntityId={entityId}
        />
      )} */}
      <div className={`entityItem-container ${childRoute ? "childRoute" : ""}`}>
        <div className="entityItem-header">
          <SearchInputSimple
            disabled={loading}
            setSearchState={setSearchState}
            placeholder={placeholder}
          />
          <button
            data-size="small"
            className="button primaryButton"
            onClick={() => {
              navigate("newitem");
              //createNewItem();
            }}
            disabled={loading}
          >
            <Icon_add />
            <span className="body-m-medium">{buttonTitle}</span>
          </button>
        </div>

        {initDataItem && initDataItem.collectionName && (
          <ListsItemsInTab
            initData={initDataItem}
            searchState={searchState}
            setModalCreateOpen={setModalCreateOpen}
            setCurrentItem={setCurrentItem}
          />
        )}
      </div>
      <Outlet />
    </React.Fragment>
  );
};

export default EntityItem;
