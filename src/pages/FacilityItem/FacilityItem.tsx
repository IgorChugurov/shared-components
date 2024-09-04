import React, { useContext, useEffect, useState } from "react";
import "./FacilityItem.css";

import { IGroupCompanies } from "../../types/groupCompanies";
import { servicesPackage } from "../../services/servicesPackage";

import { GlobalStateContext } from "../../context/GlobalStateProvider";
import { IOptionsListItem } from "../../types/appdata";

import Tabs from "../../components/tabs/Tabs";

import SearchInputSimple from "../../components/searchInput/SearchInputSimple";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import ListsItemsInTab from "../../components/listItemsInTab/ListItemsInTab";

import { getAnyEntity } from "../../utils/createUpdateDeleteAnyEntity";

import { setCurrentFacilityLS } from "../../services/localStorage";
import FacilitySettings from "./components/FacilitySettings/FacilitySettings";
import ListsItemsForAllItems from "../../components/listsItemsForAllItems/ListsItemsForAllItems";

const FacilityItem = ({
  initDataFacilities,
  initDataEntity,
  initDataFields,
  initDataUsers,
  initDataSettings,
  initTab = 0,
}: {
  initDataFacilities: IOptionsListItem;
  initDataEntity: IOptionsListItem;
  initDataFields: IOptionsListItem;
  initDataUsers: IOptionsListItem;
  initDataSettings: IOptionsListItem;
  initTab?: number;
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const facilityId = location.pathname.split("/")[2];
  //save current facility in local storage for use in the request as a header

  const { currentProject } = useContext(GlobalStateContext);
  // Check if the current path contains a nested route (check for the presence of a second segment after /group/:id)
  const isChildRoute = location.pathname.split("/").length > 4;
  const primaryRoute = location.pathname.split("/").slice(0, -1).join("/");

  // this const use for disabled interaction with page when data is loading in the tabs
  const [loading, setLoading] = useState<boolean>(false);
  const [searchState, setSearchState] = useState<string>("");

  const {
    reloadEventTitle,
    title: titleFacilities,
    collectionName: collectionNameFacility,
  } = initDataFacilities;

  // this is data for tabs
  const { forList: forListEntity, title: titleEntity } = initDataEntity;
  const { forList: forListUsers, title: titleUsers } = initDataUsers;
  const { searchBlock: placeholderSearchEntity } = forListEntity;
  const { searchBlock: placeholderSearchUsers } = forListUsers;
  const { title: titleSettings } = initDataSettings;
  const [tab, setTab] = useState<number>(initTab);
  const [placeholder, setPlaceholder] = useState<string>(
    placeholderSearchEntity || "Search ..."
  );
  const facilityService = servicesPackage[collectionNameFacility];
  const [item, setItem] = useState<IGroupCompanies | null>(null);
  const changeRouteData = useContext(GlobalStateContext).changeRouteData;

  setCurrentFacilityLS(facilityId || "");
  useEffect(() => {
    setLoading(true);
    getAnyEntity(facilityId, facilityService).then((res) => {
      const facility: IGroupCompanies = res as unknown as IGroupCompanies;
      changeRouteData({ facility });
      setItem(facility);
      setLoading(false);
    });
  }, []);
  useEffect(() => {
    setLoading(true);
    const handleReload = () => {
      getAnyEntity(facilityId, facilityService).then((res) => {
        const facility: IGroupCompanies = res as unknown as IGroupCompanies;
        changeRouteData({ facility });
        setItem(facility);
        setLoading(false);
      });
    };
    if (reloadEventTitle) {
      window.addEventListener(reloadEventTitle, handleReload);
    }
    return () => {
      if (reloadEventTitle) {
        window.removeEventListener(reloadEventTitle, handleReload);
      }
    };
  }, [reloadEventTitle]);

  useEffect(() => {
    switch (tab) {
      case 0:
        setPlaceholder(placeholderSearchEntity || "Search ...");
        break;
      case 1:
        setPlaceholder(placeholderSearchUsers || "Search ...");
        break;
      default:
        break;
    }
  }, [tab]);
  const setTabForTabs = (tab: number) => {
    setTab(tab);
    if (tab === 0) {
      navigate(`${primaryRoute}/entities`);
    } else if (tab === 1) {
      navigate(`${primaryRoute}/settings`);
    } else if (tab === 2) {
      navigate(`${primaryRoute}/users`);
    }
  };
  return (
    <React.Fragment>
      <Outlet />
      <div className={`facility-container ${isChildRoute ? "childRoute" : ""}`}>
        <Tabs
          tabs={[titleEntity, titleSettings, titleUsers]}
          setTab={setTabForTabs}
          tab={tab}
        />
        {tab === 0 && (
          <>
            <div className="facility-header">
              <SearchInputSimple
                disabled={loading}
                setSearchState={setSearchState}
                placeholder={placeholder}
              />
            </div>
            <ListsItemsForAllItems
              initData={initDataEntity}
              searchState={searchState}
            />
          </>
        )}
        {tab === 2 && item && item.id && (
          <>
            <div className="facility-header">
              <SearchInputSimple
                disabled={loading}
                setSearchState={setSearchState}
                placeholder={placeholder}
              />
            </div>
            <ListsItemsInTab
              initData={initDataUsers}
              searchState={searchState}
              params={{ facilityId: item?.id }}
            />
          </>
        )}
        {tab === 1 && item && item.id && (
          <FacilitySettings
            facility={item}
            initDataSettings={initDataSettings}
          />
        )}
      </div>
    </React.Fragment>
  );
};
export default React.memo(FacilityItem);
