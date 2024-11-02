import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { IOptionsListItem } from "../../types/appdata";
import CustomGrid from "../customGrid/CustomGrid";
import { INIT_PAGINATE } from "../../constants/constants";
import { columnsForDataGrid } from "../gridColumns/ColumnsForDataGrid";

import { servicesPackage } from "../../services/servicesPackage";
import { IPaginate } from "../../types/request";

/**
 * Renders a component that displays a list of items in a tab.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {IOptionsListItem} props.initData - The initial data for the list items.
 * @param {string} props.searchState - The search state for filtering the list items.
 * @param {Object} [props.params={}] - The predefined parameters for the server request.
 * @param {Dispatch<SetStateAction<boolean>>} [props.setModalCreateOpen] - The function to open the edit modal from the parent component for updating an entity.
 * @returns {JSX.Element} The rendered component.
 */

const ListsItemsInTab = ({
  initData,
  searchState,
  params = {},
  setModalCreateOpen,
  setCurrentItem,
  headers,
}: {
  initData: IOptionsListItem;
  searchState: string;
  params?: any; // predifined params for request to the server
  setModalCreateOpen?: Dispatch<SetStateAction<boolean>>; // function to open edit modal from parent component for update entity
  setCurrentItem?: (d: any) => void;
  headers?: any;
}) => {
  //console.log(headers);
  const { forList, title, collectionName, reloadEventTitle } = initData;

  const { columnsForGrid, forEmptyList, messages } = forList;
  const { afterDelete: deleteMessage } = messages || {};

  const itemsService = servicesPackage[collectionName];
  const [items, setItems] = useState<any[]>([]);

  const [rowSelectionModel, setRowSelectionModel] = useState<string[]>([]);
  const [columns, setColumns] = useState<any[]>([]);
  const [paginate, setPaginate] = useState<IPaginate>({
    ...INIT_PAGINATE,
    search: searchState,
  });
  const handlePaginationModelChange = (data: {
    page: number;
    pageSize: number;
  }) => {
    setPaginate((prev: any) => ({
      ...prev,
      currentPage: data.page + 1,
      perPage: data.pageSize,
      loaded: false,
    }));
  };

  useEffect(() => {
    if (!paginate.loaded && itemsService && itemsService.getMany) {
      itemsService
        .getMany(paginate, params, headers)
        .then((res: any) => {
          const data = res.items || [];
          setItems(
            data.map((d: any) => ({
              ...d,
            }))
          );
          //console.log(res.meta);
          const totalItems = res.meta?.totalItems || 0;

          const totalPages = Math.ceil(totalItems / paginate.perPage);
          setPaginate((prev) => ({
            ...prev,
            currentPage: paginate.currentPage,
            perPage: paginate.perPage,
            totalItems: totalItems,
            totalPages: totalPages,
            loaded: true,
          }));
        })
        .catch((err: any) => {
          console.log(err);
        })
        .finally(() => {
          //setLoading(false);
        });
    }
  }, [paginate]);

  useEffect(() => {
    if (!paginate.search && !searchState) {
      return;
    }
    const tempPagination = Object.assign({}, paginate);
    tempPagination.search = searchState;
    if (!tempPagination.search) {
      delete tempPagination?.search;
    }
    tempPagination.loaded = false;
    tempPagination.currentPage = 1;
    setPaginate(tempPagination);
  }, [searchState]);

  useEffect(() => {
    // Define the event handler function
    const handleReload = () => {
      setPaginate((prev) => ({
        ...prev,
        loaded: false,
      }));
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
    <CustomGrid
      rowSelectionModel={rowSelectionModel}
      setRowSelectionModel={setRowSelectionModel}
      handlePaginationModelChange={handlePaginationModelChange}
      items={items}
      paginate={paginate}
      columns={columns}
      forEmptyList={forEmptyList}
    />
  );
};

export default ListsItemsInTab;
