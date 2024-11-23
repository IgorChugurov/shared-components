import { IDataForEditPage, IOptionsForActionDelete } from "./edit-page";
import { IColumnForDataGrud } from "./grid";

/**
 * Configuration for list views
 */
export interface IOptionsListItem {
  /** Page title */
  title: string;

  /** Collection name */
  collectionName: string;

  /** Service configuration */
  forServicePackage: {
    url: string;
    options?: any;
    reloadEvents?: {
      delete?: string;
      update?: string;
      create?: string;
    };
  };

  /** Refresh event name */
  reloadEventTitle?: string;

  /** List view configuration */
  forList: {
    searchBlock?: string;
    filters?: {
      collection: string;
      title: string;
      filteredFiled?: string;
    }[];
    buttonBlock?: {
      title: string;
    };
    columnsForGrid: IColumnForDataGrud[];
    forEmptyList?: {
      title: string;
      messages: string[];
    };
    messages?: {
      afterCreate?: string;
      afterUpdate?: string;
      afterDelete?: string;
      forDeleteModal?: IOptionsForActionDelete;
    };
  };

  /** Edit form configuration */
  forEdit: IDataForEditPage;
}
