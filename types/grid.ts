import { IOptionsForActionDelete } from "./edit-page";

/**
 * Configuration for grid column actions
 */
export interface IActionData {
  /** Action type */
  action: "delete" | "edit" | "clone" | "view" | "copy" | "actions" | string;

  /** Whether to use router link */
  link?: boolean;

  /** Icon name */
  icon?: string;

  /** Action options */
  options?: IOptionsForActionDelete;

  /** Fields to copy */
  copyFields?: { field: string }[];

  /** Custom component */
  component?: any;

  /** Additional URL */
  additioonalUrl?: string;
}

/**
 * Configuration for data grid columns
 */
export interface IColumnForDataGrud {
  /** Field identifier */
  field: string;

  /** Column header text */
  headerName: string;

  /** Fixed width */
  width?: number;

  /** Flex grow */
  flex?: number;

  /** Column type */
  type?:
    | "view"
    | "openEditPage"
    | "actions"
    | "naigateToDetails"
    | "date"
    | string;

  /** Column options */
  options?: {
    actions?: IActionData[];
  };

  additioonalUrl?: string;
  hideContentIsDeleteAction?: boolean;
}
