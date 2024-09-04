import React, { useContext, useEffect, useState } from "react";
import { IEditField, IOptionsListItem } from "../../types/appdata";
import { GlobalStateContext } from "../../context/GlobalStateProvider";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { servicesPackage } from "../../services/servicesPackage";
import { createAnyEntity, getItemForEdit } from "../../utils";

import styles from "./Settings.module.css";

import { IEntity } from "../../types/entity";
import { updateAnyEntity } from "../../utils/createUpdateDeleteAnyEntity";
import Createmodal from "../../components/appmodal/Createmodal";
import Tabs from "../../components/tabs/Tabs";
import ProjectSettings from "./components/projectSettings/ProjectSettings";
import SearchInputSimple from "../../components/searchInput/SearchInputSimple";
import { Icon_add } from "../../components/icons/Icons";
import ListsItemsInTab from "../../components/listItemsInTab/ListItemsInTab";
import ProjectEnvironment from "./components/projectEnvironment/ProjectEnvironment";

const Settings = ({
  initDataProjects,
  initDataAppAdmins,
  initDataProjectSettings,
  initDataEntity,
  initDataEnvironment,
  initTab,
}: {
  initDataProjects: IOptionsListItem;
  initDataAppAdmins: IOptionsListItem;
  initDataProjectSettings: IOptionsListItem;
  initDataEntity: IOptionsListItem;
  initDataEnvironment: IOptionsListItem;
  initTab: number;
}) => {
  const { title: titleEnvironments } = initDataEnvironment;
  const {
    collectionName: collectionNameAdmins,
    forList: forListAdmins,
    title: titleAdmins,
    forEdit: forEditAdmin,
  } = initDataAppAdmins;
  const {
    searchBlock: placeholderSearchAdmins,
    buttonBlock: buttonBlockAdmins,
    messages: messagesAdmins,
  } = forListAdmins;
  const {
    collectionName: collectionNameEntities,
    forList: forListEntities,
    title: titleEntities,
    forEdit: forEditEntities,
  } = initDataEntity;
  const {
    searchBlock: placeholderSearchEntities,
    buttonBlock: buttonBlockEntities,
    messages: messagesEntities,
  } = forListEntities;

  const { afterCreate: afterCreateMessageAdmin } = messagesAdmins || {};
  const { afterCreate: afterCreateMessageEntitie } = messagesEntities || {};

  const { title: titleSettings } = initDataProjectSettings;

  const [modalCreateOpen, setModalCreateOpen] = useState(false);
  const [forEditData, setForEditData] = useState<any>(forEditAdmin);
  const [allFields, setAllFields] = useState<IEditField[]>(
    forEditAdmin.sections.reduce((acc: any, section: any) => {
      acc = [...acc, ...section.fields];
      return acc;
    }, [])
  );
  const isChildRoute = location.pathname.split("/").length > 3;

  const [currentItem, setCurrentItem] = useState<IEntity | null>(null);

  const [modalEditOpen, setModalEditOpen] = useState(false);

  // this const use for disabled interaction with page when data is loading in the tabs
  const [loading, setLoading] = useState<boolean>(false);
  const [searchState, setSearchState] = useState<string>("");
  const primaryRoute = location.pathname.split("/").slice(0, -1).join("/");
  const navigate = useNavigate();
  const [tab, setTab] = useState<number>(initTab);
  const [placeholder, setPlaceholder] = useState<string>(
    placeholderSearchAdmins || "Search ..."
  );
  const [buttonBlock, setButtonBlock] = useState<any>(buttonBlockAdmins);

  const [tabService, setTabService] = useState<any>({});
  const [afterCreateMessage, setAfterCreateMessage] = useState<string>("");

  const createData = async (data: any) => {
    const dataToSend = { ...data };
    if (currentItem) {
      dataToSend.id = currentItem.id;

      await updateAnyEntity(
        currentItem.id,
        dataToSend,
        tabService,
        afterCreateMessage
      );
    } else {
      await createAnyEntity(dataToSend, tabService, afterCreateMessage);
    }
  };

  useEffect(() => {
    switch (tab) {
      case 0:
        setAllFields(
          forEditAdmin.sections.reduce((acc: any, section: any) => {
            acc = [...acc, ...section.fields];
            return acc;
          }, [])
        );
        setForEditData(forEditAdmin);
        setPlaceholder(placeholderSearchAdmins || "Search ...");
        setButtonBlock(buttonBlockAdmins);
        setTabService(servicesPackage[collectionNameAdmins]);
        setAfterCreateMessage(afterCreateMessageAdmin || "");
        break;
      case 3:
        setAllFields(
          forEditEntities.sections.reduce((acc: any, section: any) => {
            acc = [...acc, ...section.fields];
            return acc;
          }, [])
        );
        setForEditData(forEditEntities);
        setPlaceholder(placeholderSearchEntities || "Search ...");
        setButtonBlock(buttonBlockEntities);
        setTabService(servicesPackage[collectionNameEntities]);
        setAfterCreateMessage(afterCreateMessageEntitie || "");
        break;
      default:
        break;
    }
  }, [tab]);
  const setTabForTabs = (tab: number) => {
    setTab(tab);
    if (tab === 0) {
      navigate(`${primaryRoute}/admins`);
    } else if (tab === 1) {
      navigate(`${primaryRoute}/project`);
    } else if (tab === 3) {
      navigate(`${primaryRoute}/entities`);
    } else if (tab === 2) {
      navigate(`${primaryRoute}/environments`);
    }
  };

  return (
    <React.Fragment>
      {modalCreateOpen && (
        <Createmodal
          fields={allFields}
          dataForPage={forEditData}
          currentItem={currentItem}
          openModal={modalCreateOpen}
          handleCloseModal={() => setModalCreateOpen(false)}
          setOpenModal={setModalCreateOpen}
          handleAction={createData}
        />
      )}
      <Outlet />
      {/* {modalEditOpen && (
        <CreateItem
          allFields={allFields}
          dataForEditPage={forEditEntities}
          messages={forListEntities.messages}
          currentItem={getItemForEdit(allFields, currentItem)}
          openModal={modalEditOpen}
          handleCloseModal={() => setModalEditOpen(false)}
          setOpenModal={setModalEditOpen}
          itemsService={tabService}
        />
      )} */}
      <div
        className={`${styles.container} ${
          isChildRoute ? styles.childRoute : ""
        }`}
      >
        <Tabs
          tabs={[titleAdmins, titleSettings, titleEnvironments, titleEntities]}
          setTab={setTabForTabs}
          tab={tab}
        />
        {tab === 1 && (
          <ProjectSettings
            initSettingData={initDataProjectSettings}
            initDataProjects={initDataProjects}
          />
        )}
        {tab === 2 && (
          <ProjectEnvironment initDataEnvironment={initDataEnvironment} />
        )}
        {tab === 0 && (
          <>
            <div className={styles.header}>
              <SearchInputSimple
                disabled={loading}
                setSearchState={setSearchState}
                placeholder={placeholder || "Search ..."}
              />
              <button
                data-size="small"
                className="button primaryButton"
                onClick={() => {
                  setModalCreateOpen(true);
                }}
                disabled={loading}
              >
                <Icon_add />
                <span className="body-m-medium">{buttonBlock?.title}</span>
              </button>
            </div>
            <ListsItemsInTab
              initData={initDataAppAdmins}
              searchState={searchState}
            />
          </>
        )}
        {tab === 3 && (
          <>
            <div className={styles.header}>
              <SearchInputSimple
                disabled={loading}
                setSearchState={setSearchState}
                placeholder={placeholder || "Search ..."}
              />
              <button
                data-size="small"
                className="button primaryButton"
                onClick={() => {
                  setCurrentItem(null);
                  setModalCreateOpen(true);
                }}
                disabled={loading}
              >
                <Icon_add />
                <span className="body-m-medium">{buttonBlock?.title}</span>
              </button>
            </div>
            <ListsItemsInTab
              initData={initDataEntity}
              searchState={searchState}
              setModalCreateOpen={setModalCreateOpen}
              setCurrentItem={setCurrentItem}
            />
          </>
        )}
      </div>
    </React.Fragment>
  );
};

export default Settings;
