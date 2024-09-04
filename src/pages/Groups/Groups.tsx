// this is component for list of goups of companies
// the ldata stucture is written in the file src/types/groupCompanies.ts
import React, { useEffect, useState } from "react";
import styles from "./Groups.module.css";
import { Icon_add, Icon_east, Icon_Plus } from "../../components/icons/Icons";
import { Link, Outlet, useLocation } from "react-router-dom";
import { IEditField, IOptionsListItem } from "../../types/appdata";
import Createmodal from "../../components/appmodal/Createmodal";
import { servicesPackage } from "../../services/servicesPackage";
import { createAnyEntity } from "../../utils";
import { IGroupCompanies } from "../../types/groupCompanies";
import "./Groups.css";
import SearchInputSimple from "../../components/searchInput/SearchInputSimple";
import ListsItemsInTab from "../../components/listItemsInTab/ListItemsInTab";

const Groups = ({
  initDataGroupCompanies,
  table,
}: {
  initDataGroupCompanies: IOptionsListItem;
  table?: boolean;
}) => {
  const { forEdit, forList, reloadEventTitle, collectionName } =
    initDataGroupCompanies;
  const itemsService = servicesPackage[collectionName];
  const [modalCreateOpen, setModalCreateOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchState, setSearchState] = useState<string>("");
  // get data from initDataGroupsCompanies for create new group of companies

  const { afterCreate: afterCreateMessage } = forList.messages || {};
  const { forEmptyList, searchBlock: placeholderSearch, buttonBlock } = forList;

  const buttonTitle = forList.buttonBlock?.title || "new facility group";
  const allFields: IEditField[] = forEdit.sections.reduce(
    (acc: any, section: any) => {
      acc = [...acc, ...section.fields];
      return acc;
    },
    []
  );

  const location = useLocation();
  const [groupsCompanies, setGroupsCompanies] = useState<IGroupCompanies[]>([]);
  const createGroupCompamies = async (data: any) => {
    await createAnyEntity(data, itemsService, afterCreateMessage);
  };
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
  }, []);
  useEffect(() => {
    // Define the event handler function
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

  return (
    <>
      {modalCreateOpen && (
        <Createmodal
          fields={allFields}
          dataForPage={forEdit}
          openModal={modalCreateOpen}
          handleCloseModal={() => setModalCreateOpen(false)}
          setOpenModal={setModalCreateOpen}
          handleAction={createGroupCompamies}
        />
      )}
      {!table ? (
        <div
          className={`${styles.containerForTable} ${
            location.pathname !== "/groups" ? styles.childRoute : ""
          }`}
        >
          <div className={styles.headerForTable}>
            <SearchInputSimple
              disabled={loading}
              setSearchState={setSearchState}
              placeholder={placeholderSearch || "Search ..."}
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
            initData={initDataGroupCompanies}
            searchState={searchState}
          />
        </div>
      ) : (
        <div
          className={`${styles.container} ${
            location.pathname !== "/groups" ? styles.childRoute : ""
          }`}
        >
          <div className={styles.header}>
            <button
              className={`button primaryButton`}
              data-size="small"
              onClick={() => setModalCreateOpen(true)}
            >
              <Icon_Plus />
              <span className={`body-m-medium`}>{buttonTitle}</span>
            </button>
          </div>
          {groupsCompanies.length ? (
            <div className={styles.companiesGroup}>
              {groupsCompanies.map((group, i) => (
                <GroupCompanies group={group} key={i} />
              ))}
            </div>
          ) : (
            <EmptyState
              title={forEmptyList?.title || ""}
              messages={forEmptyList?.messages}
            />
          )}
        </div>
      )}

      <Outlet />
    </>
  );
};

export default Groups;

const GroupCompanies = ({ group }: { group: any }) => {
  const [isHovered, setIsHovered] = useState(false);
  const getCompanyLabel = (qty: number) => {
    if (qty === 1) {
      return "facility";
    } else {
      return "facilities";
    }
  };
  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={styles.groupCard}
    >
      <div className={styles.companies}>
        {Array.from({ length: 4 }).map((_, index) => (
          <React.Fragment key={index}>
            {group.facilities && group.facilities[index] ? (
              <Link
                to={`/groups/${group.id}/facilities/${group.facilities[index].id}/settings`}
              >
                <div className={`${styles.company} companyInGroupCard`}>
                  <span className={`${styles.companyTitle} body-s-medium`}>
                    {group.facilities[index].name}
                  </span>
                </div>
              </Link>
            ) : (
              <div className={`${styles.company} ${styles.empty}`}></div>
            )}
          </React.Fragment>
        ))}
      </div>
      <div className={styles.cardFooter}>
        <div className={styles.textWrapper}>
          <span className={`${styles.groupTitle} body-l-bold`}>
            {group.name}
          </span>
          <div className={styles.groupInfoWrapper}>
            <span className={`${styles.groupInfo} body-s-medium`}>
              {`${
                group.facilitiesQty ? group.facilitiesQty : "no"
              } ${getCompanyLabel(group.facilitiesQty)}`}
            </span>
          </div>
        </div>
        {isHovered && (
          <Link to={`/groups/${group.id}/facilities`}>
            <button className={` iconButton primaryIconButton`}>
              <Icon_east />
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};
const EmptyState: React.FC<{ title?: string; messages?: string[] }> = ({
  title,
  messages,
}) => {
  const [titleComponent] = useState(title || "You have no items");
  const [messagesComponent] = useState(
    messages || [
      "Item that you create will end up here.",
      "Add a new item to get started.",
    ]
  );
  return (
    <div className={styles.emptyStateWrapper}>
      <span className={`${styles.headerEmptyState} body-l-medium`}>
        {titleComponent}
      </span>
      <div className={styles.emptyStateTextWrapper}>
        {messagesComponent.map((message, index) => (
          <span
            key={index}
            className={`${styles.headerEmptyText} body-m-multiline`}
          >
            {message}
          </span>
        ))}
      </div>
    </div>
  );
};
