import { IEditField } from "./fields";

/**
 * Delete action options
 */
export interface IOptionsForActionDelete {
  modalText?: string;
  modalTitle?: string;
  confirmWord?: string;
  confirmText?: string;
  buttonTitle?: string;
}

/**
 * Edit page configuration
 */
export interface IDataForEditPage {
  /** Page titles for create/edit modes */
  title: string[];

  /** Page header text */
  pageHeader?: string;

  /** Page sections */
  sections: {
    /** Section container class */
    className?: string;

    /** Section info */
    info?: {
      title: string;
      text: string;
    };

    /** Section title */
    title: string;

    /** Section fields */
    fields: IEditField[];

    /** Section action button */
    button?: {
      title: string;
      label?: string;
      action: string;
      options?: IOptionsForActionDelete;
    };
  }[];

  /** Event name for data refresh */
  reloadEventTitle?: string;

  /** Button text overrides */
  buttons?: {
    create?: string;
    update?: string;
  };

  buttonText?: {
    create?: string;
    update?: string;
  };
}
