import React, { useContext, useEffect, useState } from "react";
import { servicesPackage } from "../../services/servicesPackage";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { IEditField, IOptionsListItem } from "../../types/appdata";

import "./Entity.css";

import { createAnyEntity, getItemForEdit } from "../../utils";
import { getAnyEntity } from "../../utils/createUpdateDeleteAnyEntity";
import Tabs from "../../components/tabs/Tabs";
//import EntitySetting from "./EntitySetting/EntitySetting";
import SearchInputSimple from "../../components/searchInput/SearchInputSimple";
import { Icon_add } from "../../components/icons/Icons";
import { IEntity } from "../../types/entity";
import { GlobalStateContext } from "../../context/GlobalStateProvider";
import ListsItemsForAllItems from "../../components/listsItemsForAllItems/ListsItemsForAllItems";
import { IField } from "../../types/field";
import CreateItem from "../../components/createItem/CreateItem";

const Entity = ({
  initDataEntity,
  initDataFields,
  initTab = 0,
}: {
  initDataEntity: IOptionsListItem;
  initDataFields: IOptionsListItem;
  initTab?: number;
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [searchState, setSearchState] = useState<string>("");
  const {
    reloadEventTitle,
    title: titleEntitty,
    collectionName: entityCollectionName,
  } = initDataEntity;
  const {
    collectionName: fieldCollectionName,
    forList: forListFields,
    title: titleFields,
    forEdit: forEditFields,
  } = initDataFields;

  const {
    searchBlock: placeholderSearchFields,
    buttonBlock: buttonBlockFields,
  } = forListFields;
  const { afterCreate: afterCreateMessageFields } =
    forListFields.messages || {};

  const [modalCreateOpen, setModalCreateOpen] = useState(false);
  const [forEditData, setForEditData] = useState<any>(forEditFields);
  const [allFields, setAllFields] = useState<IEditField[]>(
    forEditFields.sections.reduce((acc: any, section: any) => {
      acc = [...acc, ...section.fields];
      return acc;
    }, [])
  );
  const { changeRouteData, routeData } = useContext(GlobalStateContext);
  const [item, setItem] = useState<IEntity | null>(null);

  const [tab, setTab] = useState<number>(initTab);
  const [placeholder, setPlaceholder] = useState<string>(
    placeholderSearchFields || "Search ..."
  );
  const [buttonBlock, setButtonBlock] = useState<any>(buttonBlockFields);

  const itemsService = servicesPackage[entityCollectionName];
  const fieldsService = servicesPackage[fieldCollectionName];

  const location = useLocation();
  const navigate = useNavigate();
  const entityId = location.pathname.split("/")[3];

  const primaryRoute = location.pathname.split("/").slice(0, -1).join("/");
  // const createData = (data: any) => {
  //   const dataForSend = { ...data };
  //   createAnyEntity(dataForSend, fieldsService, afterCreateMessageFields);
  // };
  const [currentItem, setCurrentItem] = useState<
    IField | { entityDefinitionId: string } | null
  >(null);

  const createNewItem = () => {
    setCurrentItem({ entityDefinitionId: entityId });
    setModalCreateOpen(true);
  };

  useEffect(() => {
    if (itemsService) {
      changeRouteData({ entity: null });
      setLoading(true);
      getAnyEntity(entityId, itemsService).then((res) => {
        const entity: IEntity = res as unknown as IEntity;
        setLoading(false);
        changeRouteData({ entity: entity });
        setItem(entity);
      });
    }
  }, []);

  useEffect(() => {
    // Define the event handler function
    changeRouteData({ entity: null });
    const handleReload = () => {
      getAnyEntity(entityId, itemsService).then((res) => {
        const entity: IEntity = res as unknown as IEntity;
        changeRouteData({ entity: entity });
        setLoading(false);
        setItem(entity);
      });
    };

    // Add the event handler
    if (reloadEventTitle) {
      window.addEventListener(reloadEventTitle, handleReload);
    }

    // Remove the event handler
    return () => {
      if (reloadEventTitle) {
        window.removeEventListener(reloadEventTitle, handleReload);
      }
    };
  }, [reloadEventTitle]);

  useEffect(() => {
    switch (tab) {
      case 1:
        setAllFields(
          forEditFields.sections.reduce((acc: any, section: any) => {
            acc = [...acc, ...section.fields];
            return acc;
          }, [])
        );
        setForEditData(forEditFields);
        setPlaceholder(placeholderSearchFields || "Search ...");
        setButtonBlock(buttonBlockFields);
        break;

      default:
        break;
    }
  }, [tab]);
  const setTabForTabs = (tab: number) => {
    setTab(tab);
    if (tab === 0) {
      navigate(`${primaryRoute}/fields`);
    } else if (tab === 1) {
      navigate(`${primaryRoute}/settings`);
    }
  };

  return (
    <React.Fragment>
      {modalCreateOpen && (
        <CreateItem
          initAllFields={allFields}
          dataForEditPage={forEditFields}
          messages={forListFields.messages}
          currentItem={getItemForEdit(allFields, currentItem)}
          openModal={modalCreateOpen}
          handleCloseModal={() => setModalCreateOpen(false)}
          setOpenModal={setModalCreateOpen}
          itemsService={fieldsService}
          parentEntityId={entityId}
        />
      )}

      <Outlet />
      <div className={`entity-container`}>
        <Tabs
          tabs={[titleFields, "Settings"]}
          setTab={setTabForTabs}
          tab={tab}
        />
        {/* {tab === 1 && item && (
          <EntitySetting initDataEntity={initDataEntity} entity={item} />
        )} */}
        {tab === 0 && (
          <>
            <div className={`entity-header`}>
              <SearchInputSimple
                disabled={loading}
                setSearchState={setSearchState}
                placeholder={placeholder || "Search ..."}
              />
              <button
                data-size="small"
                className="button primaryButton"
                onClick={() => {
                  createNewItem();
                }}
                disabled={loading}
              >
                <Icon_add />
                <span className="body-m-medium">{buttonBlock?.title}</span>
              </button>
            </div>
            <ListsItemsForAllItems
              initData={initDataFields}
              searchState={searchState}
              setModalCreateOpen={setModalCreateOpen}
              setCurrentItem={setCurrentItem}
              params={{ entityDefinitionId: entityId }}
              headers={{ entityDefinitionId: entityId }}
            />
          </>
        )}
      </div>
    </React.Fragment>
  );
};

export default Entity;
