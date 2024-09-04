import React, { useContext, useEffect, useState } from "react";
import styles from "./Facility.module.css";
import { servicesPackage } from "../../services/servicesPackage";
import { useLocation, useNavigate } from "react-router-dom";
import { IEditField, IOptionsListItem } from "../../types/appdata";
import SearchInputSimple from "../../components/searchInput/SearchInputSimple";
import { ICompany } from "../../types/groupCompanies";
import Tabs from "../../components/tabs/Tabs";
import ListsItemsInTab from "../../components/listItemsInTab/ListItemsInTab";
import Createmodal from "../../components/appmodal/Createmodal";
import { GlobalStateContext } from "../../context/GlobalStateProvider";

import { createAnyEntity } from "../../utils";
import { getAnyEntity } from "../../utils/createUpdateDeleteAnyEntity";
import { Icon_add } from "../../components/icons/Icons";
import FacilitySettings from "./components/facilitySettings/FacilitySettings";

const Company = ({
  initDataCompany,
  initDataCompanyAdmins,
  initDataCompanySettings,
  initTab = 0,
}: {
  initDataCompany: IOptionsListItem;
  initDataCompanyAdmins: IOptionsListItem;
  initDataCompanySettings: IOptionsListItem;
  initTab?: number;
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [searchState, setSearchState] = useState<string>("");
  const { reloadEventTitle, collectionName: collectionNameFacility } =
    initDataCompany;
  const {
    collectionName: collectionNameAdmis,
    forList: forListAdmins,
    title: titleAdmins,
    forEdit: forEditAdmins,
  } = initDataCompanyAdmins;
  const { title: titleSettings } = initDataCompanySettings;

  const {
    searchBlock: placeholderSearchAdmins,
    buttonBlock: buttonBlockAdmins,
  } = forListAdmins;
  const { afterCreate: afterCreateMessageAdmin } = forListAdmins.messages || {};

  const [modalCreateOpen, setModalCreateOpen] = useState(false);
  const [forEditData, setForEditData] = useState<any>(forEditAdmins);
  const [allFields, setAllFields] = useState<IEditField[]>(
    forEditAdmins.sections.reduce((acc: any, section: any) => {
      acc = [...acc, ...section.fields];
      return acc;
    }, [])
  );
  const [item, setItem] = useState<ICompany | null>(null);

  const [tab, setTab] = useState<number>(initTab);
  const [placeholder, setPlaceholder] = useState<string>(
    placeholderSearchAdmins || "Search ..."
  );
  const [buttonBlock, setButtonBlock] = useState<any>(buttonBlockAdmins);

  const itemsService = servicesPackage[collectionNameFacility];
  const adminsService = servicesPackage[collectionNameAdmis];

  const location = useLocation();
  const navigate = useNavigate();
  const companyId = location.pathname.split("/")[4];
  const changeRouteData = useContext(GlobalStateContext).changeRouteData;
  const primaryRoute = location.pathname.split("/").slice(0, -1).join("/");
  const createData = (data: any) => {
    const dataForSend = { ...data, facilityId: companyId };
    createAnyEntity(dataForSend, adminsService, afterCreateMessageAdmin);
  };

  useEffect(() => {
    changeRouteData({ company: null });

    if (itemsService) {
      setLoading(true);
      getAnyEntity(companyId, itemsService).then((res) => {
        const company: ICompany = res as unknown as ICompany;

        setLoading(false);
        changeRouteData({ company: company });
        setItem(company);
      });
    }
  }, []);

  useEffect(() => {
    // Define the event handler function
    const handleReload = () => {
      getAnyEntity(companyId, itemsService).then((res) => {
        const company: ICompany = res as unknown as ICompany;

        setLoading(false);
        changeRouteData({ company: company });
        setItem(company);
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
          forEditAdmins.sections.reduce((acc: any, section: any) => {
            acc = [...acc, ...section.fields];
            return acc;
          }, [])
        );
        setForEditData(forEditAdmins);
        setPlaceholder(placeholderSearchAdmins || "Search ...");
        setButtonBlock(buttonBlockAdmins);
        break;

      default:
        break;
    }
  }, [tab]);
  const setTabForTabs = (tab: number) => {
    setTab(tab);
    if (tab === 0) {
      navigate(`${primaryRoute}/settings`);
    } else if (tab === 1) {
      navigate(`${primaryRoute}/admins`);
    } else if (tab === 2) {
    }
  };

  return (
    <React.Fragment>
      {modalCreateOpen && (
        <Createmodal
          fields={allFields}
          dataForPage={forEditData}
          openModal={modalCreateOpen}
          handleCloseModal={() => setModalCreateOpen(false)}
          setOpenModal={setModalCreateOpen}
          handleAction={createData}
        />
      )}
      <div className={styles.container}>
        <Tabs
          tabs={[titleSettings, titleAdmins, "kldkdkd"]}
          setTab={setTabForTabs}
          tab={tab}
        />
        {tab === 0 && item && (
          <FacilitySettings
            initSettingData={initDataCompanySettings}
            company={item}
            initDataCompany={initDataCompany}
          />
        )}
        {tab === 1 && (
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
              initData={initDataCompanyAdmins}
              searchState={searchState}
              params={{ facilityId: companyId }}
            />
          </>
        )}
      </div>
    </React.Fragment>
  );
};

export default Company;
