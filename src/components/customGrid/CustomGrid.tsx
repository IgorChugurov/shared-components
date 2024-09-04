import { DataGrid, GridCellParams, MuiEvent } from "@mui/x-data-grid";
import React from "react";
import { IPaginate } from "../../types/request";
import NoRowsOverlay from "../customNoRowsOverlay/CustomNoRowsOverlay";

const CustomGrid = ({
  columns,
  paginate,
  items,
  handlePaginationModelChange,
  rowSelectionModel,
  setRowSelectionModel,
  forEmptyList,
}: {
  items: any[];
  columns: any;
  paginate: IPaginate;
  handlePaginationModelChange: (d: any) => void;
  rowSelectionModel: string[];
  setRowSelectionModel: (d: any) => void;
  forEmptyList?: { title?: string; messages?: string[] };
}) => {
  return (
    <DataGrid
      className={"custom-data-grid"}
      onCellDoubleClick={(params, event) => {
        if (!event.ctrlKey) {
          event.defaultMuiPrevented = true;
        }
      }}
      onCellClick={(
        params: GridCellParams,
        event: MuiEvent<React.MouseEvent>
      ) => {
        event.defaultMuiPrevented = true;
      }}
      getRowHeight={() => "auto"}
      disableRowSelectionOnClick
      disableColumnSelector
      disableColumnFilter
      loading={!paginate.loaded}
      pagination
      paginationMode="server"
      rowCount={paginate.totalItems}
      getRowId={(row: any) => row?.id}
      pageSizeOptions={[5, 10, 25, 50, 100]}
      paginationModel={{
        page: paginate.currentPage ? paginate?.currentPage - 1 : 0,
        pageSize: paginate.perPage,
      }}
      onPaginationModelChange={handlePaginationModelChange}
      onRowSelectionModelChange={(itm: any) => {
        setRowSelectionModel(itm);
      }}
      rowSelectionModel={rowSelectionModel}
      rows={items}
      columns={columns}
      localeText={{ noRowsLabel: "No matching found" }}
      slots={{
        noRowsOverlay: NoRowsOverlay,
      }}
      slotProps={{
        noRowsOverlay: {
          title: forEmptyList?.title,
          ...(forEmptyList?.messages && { messages: forEmptyList.messages }),
        },
      }}
      //autoHeight={true}
    />
  );
};

export default CustomGrid;
