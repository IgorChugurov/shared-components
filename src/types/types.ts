export interface DataEntity {
  list: any[];
  loading: boolean;
}

export interface AppState {
  [key: string]: DataEntity;
}

// export interface AppState {
//   [key: string]: any[];
// }

export interface ActionSetData {
  type: "SET_DATA";
  payload: { name: string; data: any[] };
}

export interface ActionCreateItem {
  type: "CREATE_ITEM";
  payload: { name: string; data: any };
}
export interface ActionUpdateItem {
  type: "UPDATE_ITEM";
  payload: { name: string; id: string; data: any };
}

interface ActionDeleteItem {
  type: "DELETE_ITEM";
  payload: {
    name: string;
    id: string;
  };
}

interface ActionDeleteMultipleItems {
  type: "DELETE_MULTIPLE_ITEMS";
  payload: {
    name: string;
    ids: string[];
  };
}

interface ActionSetLoading {
  type: "SET_LOADING";
  payload: {
    name: string;
    loading: boolean;
  };
}

export type Action =
  | ActionSetData
  | ActionUpdateItem
  | ActionCreateItem
  | ActionDeleteItem
  | ActionDeleteMultipleItems
  | ActionSetLoading;
export type Dispatch = (action: Action) => void;
