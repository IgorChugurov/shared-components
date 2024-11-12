// this is component for list of goups of companies
// the ldata stucture is written in the file src/types/groupCompanies.ts
import React, { useContext, useEffect, useState } from "react";

import { Outlet, useLocation } from "react-router-dom";
import { IOptionsListItem } from "../../types/appdata";

import { servicesPackage } from "../../services/servicesPackage";
import { IGroupCompanies } from "../../types/groupCompanies";
import "./FacilitiesList.css";
import SearchInputSimple from "../../components/searchInput/SearchInputSimple";
import ListsItemsInTab from "../../components/listItemsInTab/ListItemsInTab";
import { setCurrentFacilityLS } from "../../services/localStorage";
import { GlobalStateContext } from "../../context/GlobalStateProvider";

const FacilitiesList = ({
  initDataFacilities,
}: {
  initDataFacilities: IOptionsListItem;
}) => {
  const { entitiesList } = useContext(GlobalStateContext);
  console.log(entitiesList);
  const { forEdit, forList, reloadEventTitle, collectionName } =
    initDataFacilities;
  const itemsService = servicesPackage[collectionName];

  const [searchState, setSearchState] = useState<string>("");
  // get data from initDataGroupsCompanies for create new group of companies

  const { afterCreate: afterCreateMessage } = forList.messages || {};
  const { forEmptyList, searchBlock: placeholderSearch, buttonBlock } = forList;

  const location = useLocation();
  const [groupsCompanies, setGroupsCompanies] = useState<IGroupCompanies[]>([]);

  useEffect(() => {
    itemsService.getMany().then((res: any) => {
      const items = res?.items.map((item: any) => {
        return {
          ...item,
          companies: item.companies ? item.companies : [],
        };
      });
      setGroupsCompanies(items);
    });
    setCurrentFacilityLS("");
  }, []);
  useEffect(() => {
    const handleReload = () => {
      itemsService.getMany().then((res: any) => {
        const items = res?.items.map((item: any) => {
          return {
            ...item,
          };
        });
        setGroupsCompanies(items);
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

  return (
    <>
      <div
        className={`facilities-container ${
          location.pathname !== "/facilities" ? "childRoute" : ""
        }`}
      >
        <div className="facilities-header">
          <SearchInputSimple
            setSearchState={setSearchState}
            placeholder={placeholderSearch || "Search ..."}
          />
        </div>
        <ListsItemsInTab
          initData={initDataFacilities}
          searchState={searchState}
        />
      </div>

      <Outlet />
    </>
  );
};

export default FacilitiesList;
