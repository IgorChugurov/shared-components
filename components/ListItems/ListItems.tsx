import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

import { usePaginate } from "../../hooks/usePaginate"; // Import the custom hook

import { IOptionsListItem } from "../../types/list";
import { columnsForDataGrid } from "../gridColumns/ColumnsForDataGrid";
import CustomGrid from "./components/CustomGrid";

const ListsItems = ({
  initData,
  searchState,
  options = {},
  setModalCreateOpen,
  setCurrentItem,
  showInfoBlock = false,
  itemName = "item",
  pageUrl,
  servicesPackage,
}: {
  initData: IOptionsListItem;
  searchState: string;
  options?: any;
  setModalCreateOpen?: Dispatch<SetStateAction<boolean>>;
  setCurrentItem?: (d: any) => void;
  showInfoBlock?: boolean;
  itemName?: string;
  pageUrl: string;
  servicesPackage: any;
}) => {
  //console.log("options", options);
  const { forList, collectionName, reloadEventTitle } = initData;
  const { columnsForGrid, forEmptyList, messages } = forList;
  const { afterDelete: deleteMessage } = messages || {};

  const itemsService = servicesPackage[collectionName];

  const { items, paginate, handlePaginationModelChange } = usePaginate({
    searchState,
    options,
    itemsService,
    reloadEventTitle,
  });

  const [rowSelectionModel, setRowSelectionModel] = useState<string[]>([]);
  const [columns, setColumns] = useState<any[]>([]);
  const [deleteActionIds, setDeleteActionIds] = useState<any>({});
  useEffect(() => {
    setColumns(
      columnsForDataGrid({
        setCurrentItem,
        setModalCreateOpen,
        columnsForGrid,
        dataService: itemsService,
        deleteMessage,
        setDeleteActionIds,
        deleteActionIds,
        pageUrl,
      })
    );
  }, [deleteActionIds]);

  const [infoForPage, setInfoForPage] = useState<string>("");

  useEffect(() => {
    const s = items.length === 1 ? "" : "s";
    setInfoForPage(
      `${items.length} ${itemName}${s} out of ${paginate.totalItems}`
    );
  }, [items]);

  return (
    <>
      {showInfoBlock && (
        <div className="info">
          <span className="text-secondary body-s-multiline">{infoForPage}</span>
        </div>
      )}
      <CustomGrid
        rowSelectionModel={rowSelectionModel}
        setRowSelectionModel={setRowSelectionModel}
        handlePaginationModelChange={handlePaginationModelChange}
        items={items}
        paginate={paginate}
        columns={columns}
        forEmptyList={forEmptyList}
      />
    </>
  );
};

export default ListsItems;
