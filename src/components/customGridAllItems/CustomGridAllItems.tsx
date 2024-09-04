import { DataGrid, GridCellParams, MuiEvent } from "@mui/x-data-grid";
import React from "react";
import { IPaginate } from "../../types/request";
import NoRowsOverlay from "../customNoRowsOverlay/CustomNoRowsOverlay";

const CustomGridAllItems = ({
  columns,
  items,
  forEmptyList,
  loading,
}: {
  loading: boolean;
  items: any[];
  columns: any;
  forEmptyList?: { title?: string; messages?: string[] };
}) => {
  return (
    <DataGrid
      className={"custom-data-grid hidePagination"}
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
      loading={loading}
      getRowId={(row: any) => row?.id}
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

export default CustomGridAllItems;
