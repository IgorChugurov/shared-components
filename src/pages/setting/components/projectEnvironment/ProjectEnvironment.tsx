import React, { useEffect, useState } from "react";
import styles from "./ProjectEnvironment.module.css";

import { Icon_add } from "./Icons";
import { IEditField, IOptionsListItem } from "../../../../types/appdata";
import { IEnvironment } from "../../../../types/environment";
import { servicesPackage } from "../../../../services/servicesPackage";
import CreateItem from "../../../../components/createItem/CreateItem";
import { getItemForEdit } from "../../../../utils";
import SearchInputSimple from "../../../../components/searchInput/SearchInputSimple";
import ListsItemsForAllItems from "../../../../components/listsItemsForAllItems/ListsItemsForAllItems";

const ProjectEnvironment = ({
  initDataEnvironment,
}: {
  initDataEnvironment: IOptionsListItem;
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [searchState, setSearchState] = useState<string>("");
  const [currentItem, setCurrentItem] = useState<IEnvironment | null>(null);

  const { forList, forEdit, collectionName } = initDataEnvironment;

  const { searchBlock, buttonBlock } = forList;
  const [modalCreateOpen, setModalCreateOpen] = useState(false);
  const [allFields, setAllFields] = useState<IEditField[]>(
    forEdit.sections.reduce((acc: any, section: any) => {
      acc = [...acc, ...section.fields];
      return acc;
    }, [])
  );

  const [placeholder] = useState<string>(searchBlock || "Search ...");
  const itemsService = servicesPackage[collectionName];
  // const createData = (data: any) => {
  //   createAnyEntity(data, itemsService, afterCreateMessage);
  // };
  //console.log(currentItem, modalCreateOpen);

  //console.log(allFields);
  const [tab, setTab] = useState(0);
  const createNewItem = () => {
    setCurrentItem(null);
    setModalCreateOpen(true);
  };

  const [filterState, setFilterState] = useState<any>(null);
  useEffect(() => {
    if (tab === 1) {
      setFilterState({ key: "destination", value: "first" });
    } else if (tab === 2) {
      setFilterState({ key: "destination", value: "second" });
    } else if (tab === 3) {
      setFilterState({ key: "destination", value: "project" });
    } else {
      setFilterState(null);
    }
  }, [tab]);

  return (
    <React.Fragment>
      {modalCreateOpen && (
        <CreateItem
          initAllFields={allFields}
          dataForEditPage={forEdit}
          messages={forList.messages}
          currentItem={getItemForEdit(allFields, currentItem)}
          openModal={modalCreateOpen}
          handleCloseModal={() => setModalCreateOpen(false)}
          setOpenModal={setModalCreateOpen}
          itemsService={itemsService}
        />
      )}
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <SearchInputSimple
              disabled={loading}
              setSearchState={setSearchState}
              placeholder={placeholder || "Search ..."}
            />
            <div className={styles.cheaps}>
              {["All", "Admin panel 1", "Admin panel 2", "Project"].map(
                (item, i) => (
                  <button
                    key={i}
                    className="cheapsButton"
                    data-chosen={tab === i}
                    onClick={() => {
                      setTab(i);
                    }}
                  >
                    {item}
                  </button>
                )
              )}
            </div>
          </div>
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
          initData={initDataEnvironment}
          searchState={searchState}
          filterState={filterState}
          setModalCreateOpen={setModalCreateOpen}
          setCurrentItem={setCurrentItem}
        />
      </div>
    </React.Fragment>
  );
};

export default ProjectEnvironment;
