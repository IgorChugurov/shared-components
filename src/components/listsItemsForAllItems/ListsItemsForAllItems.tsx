import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { IOptionsListItem } from "../../types/appdata";

import { columnsForDataGrid } from "../gridColumns/ColumnsForDataGrid";

import { servicesPackage } from "../../services/servicesPackage";

import CustomGridAllItems from "../customGridAllItems/CustomGridAllItems";

const ListsItemsForAllItems = ({
  initData,
  searchState,
  setCurrentItem,
  setModalCreateOpen,
  filterState,
  params,
}: {
  filterState?: any;
  initData: IOptionsListItem;
  searchState: string;
  setCurrentItem?: (d: any) => void;
  setModalCreateOpen?: Dispatch<SetStateAction<boolean>>;
  params?: any;
}) => {
  const [openConfirmModal, setOpenConfirmModal] = useState(false);

  const { forList, title, collectionName, reloadEventTitle } = initData;

  const { columnsForGrid, forEmptyList, messages } = forList;
  const { afterDelete: deleteMessage } = messages || {};
  //console.log(initData);

  const itemsService = servicesPackage[collectionName];
  const [serverItems, setServerItems] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);

  const [rowSelectionModel, setRowSelectionModel] = useState<string[]>([]);
  const [columns, setColumns] = useState<any[]>([]);

  const [loading, setLoading] = useState<boolean>(false);
  const loadItems = () => {
    setLoading(true);
    const options = { params };

    itemsService
      .getAll(options)
      .then((res: any) => {
        console.log(res);
        setServerItems(res);
      })
      .catch((err: any) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
        //setLoading(false);
      });
  };
  useEffect(() => {
    loadItems();
  }, []);

  useEffect(() => {
    setItems(
      serverItems.filter((item: any) => {
        return (
          item.name.includes(searchState) &&
          (filterState ? item[filterState.key] === filterState.value : true)
        );
      })
    );
  }, [serverItems, searchState, filterState]);

  useEffect(() => {
    // Add the event handler
    if (reloadEventTitle) {
      window.addEventListener(reloadEventTitle, loadItems);
    }
    // Remove the event handler
    return () => {
      if (reloadEventTitle) {
        window.removeEventListener(reloadEventTitle, loadItems);
      }
    };
  }, [reloadEventTitle]);

  useEffect(() => {
    setColumns(
      columnsForDataGrid({
        setCurrentItem,

        setModalCreateOpen,
        columnsForGrid,
        dataService: itemsService,
        deleteMessage,
      })
    );
  }, []);

  return (
    <CustomGridAllItems
      items={items}
      columns={columns}
      forEmptyList={forEmptyList}
      loading={loading}
    />
  );
};

export default ListsItemsForAllItems;
