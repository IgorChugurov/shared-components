//import moment from "moment";
import styles from "./Columns.module.css";

import { Dispatch, SetStateAction } from "react";

import { ApiService } from "../../services/servicesPackage";
import ActionCell from "../actionCell/ActionCell";
import { IColumnForDataGrud } from "../../types/appdata";
import { Link } from "react-router-dom";
import { GridColumnHeaderParams } from "@mui/x-data-grid";

//import ActionCell from "./ActionCell";
interface IItemInCell {
  id: string;
  [key: string]: any;
}
// create an array of columns for the data grid.
// The array is created from the array of columnsForGrid
// the columnsForGrid is an array of IColumnForDataGrud
// the array of items is used to get the data for the cells
// the dataService is used to update the data
// the setModalCreateOpen is used to open the edit or create modal
// the setCurrentItem is used to set the current item for the selected row
// the onChange is used to update the data in the parent component
// the setItems is used to update the items in the parent component
// redirect to the edit page when the cell is clicked if the type is naigateToDetails in the column

export const columnsForDataGrid = ({
  setCurrentItem,

  setModalCreateOpen,

  columnsForGrid,
  dataService,
  deleteMessage = "",
}: {
  setModalCreateOpen?: Dispatch<SetStateAction<boolean>>;

  setCurrentItem?: Dispatch<SetStateAction<any | null>>;

  columnsForGrid: IColumnForDataGrud[];
  dataService: ApiService<any>;
  deleteMessage?: string;
}) => {
  // const openForEdit = (d: IItemInCell) => {
  //   const item = items.find((p) => p.id === d.id);
  //   if (item) {
  //     if (setCurrentItem) {
  //       setCurrentItem(item);
  //     }
  //     if (setModalCreateOpen) {
  //       setModalCreateOpen(true);
  //     }
  //   }
  // };
  const columns = columnsForGrid.map((column) => {
    return getColumn({
      column,
      setModalCreateOpen,
      setCurrentItem,
      dataService,
      deleteMessage,
    });
  });
  return columns;
};
const getColumn = ({
  column,
  setModalCreateOpen,
  setCurrentItem,
  dataService,
  deleteMessage = "",
}: {
  column: IColumnForDataGrud;
  setModalCreateOpen?: Dispatch<SetStateAction<boolean>>;
  setCurrentItem?: Dispatch<SetStateAction<any | null>>;
  dataService: ApiService<any>;
  deleteMessage?: string; // for delete entity message
}) => {
  const { field, headerName, width, options, type, flex, additioonalUrl } =
    column;

  const url = window.location.pathname;
  return {
    field: field,
    headerName: headerName,
    width: width,
    flex: flex,
    disableReorder: true,
    renderHeader: (params: GridColumnHeaderParams) => (
      <span className="text-secondary mono-s-medium">{headerName}</span>
    ),
    renderCell: (params: any) => {
      const itemInRow = params.row;
      let content;

      if (type === "openEditPage") {
        content = (
          <div
            className={styles.linkWrap}
            onClick={(e: React.MouseEvent<HTMLElement>) => {
              if (setCurrentItem) {
                setCurrentItem(itemInRow);
              }
              if (setModalCreateOpen) {
                setModalCreateOpen(true);
              }
            }}
          >
            <span className=" body-m-regular text-default textWithEllipsis">
              {itemInRow[field]}
            </span>
          </div>
        );
      } else if (type === "naigateToDetails") {
        content = (
          <Link
            className={styles.linkWrap}
            to={`${url}/${itemInRow.id}${additioonalUrl ? additioonalUrl : ""}`}
          >
            <span className=" body-m-regular text-default textWithEllipsis">
              {itemInRow[field]}
            </span>
          </Link>
        );
      } else if (
        type === "actions" &&
        column.options &&
        column.options.actions
      ) {
        content = (
          <ActionCell
            actions={column.options.actions}
            rowId={itemInRow.id}
            item={itemInRow}
            setEditModalOpen={setModalCreateOpen}
            setCurrentItem={setCurrentItem}
            dataService={dataService}
            deleteMessage={deleteMessage}
          />
        );
      } else if (type === "date") {
        content = (
          <span className="body-m-regular text-default textWithEllipsis">
            {formatDate(itemInRow[field])}
          </span>
        );
      } else {
        content = (
          <span className="body-m-regular text-default textWithEllipsis">
            {itemInRow[field]}
          </span>
        );
      }

      return <div className={styles.cellInner}>{content}</div>;
    },
  };
};

function formatDate(date?: string) {
  if (!date) return "";

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };

  const localeDateString = new Date(date).toLocaleDateString("en-CA", options);
  const localeTimeString = new Date(date)
    .toLocaleTimeString("en-GB", timeOptions)
    .slice(0, 5);

  return `${localeDateString} ${localeTimeString}`;
}
