/**
 * Represents a field in the edit page.
 */
export interface IEditField {
  /**
   * The name of the field.
   */
  name: string;
  /**
   * The label of the field.
   */
  label?: string;
  /**
   * The placeholder of the field.
   */
  placeholder?: string;
  /**
   * The type of the field.
   */
  type:
    | "text"
    | "date"
    | "number"
    | "radio"
    | "switch"
    | "select"
    | "array"
    | "view"
    | "copy"
    | "file"
    | "email"
    | "password"
    | "deleteButton"
    | string;
  /**
   * The collection of the field.
   */
  collectionName?: string;
  /**
   * The helper text of the field.
   */
  helperText?: string;
  /**
   * Indicates if the field text anr textarea.
   */
  multipile?: boolean;
  /**
   * Indicates if the field is editable.
   */
  forEditPage?: "yes" | "no" | string;
  /**
   * Indicates if the field is for a new item.
   */
  forCreatePage?: "yes" | "no" | string;
  /**
   * Indicates if the field is required.
   */
  required?: boolean;
  /**
   * Indicates if the field is disabled for edit page.
   */
  forEditPageDisabled?: boolean;
  /**
   * The text to display when the field is required.
   */
  requiredText?: string;
  /**
   * The text to display when the field value is less than the minimum value.
   */
  minValueText?: string;
  /**
   * The text to display when the field value is greater than the maximum value.
   */
  maxValueText?: string;
  /**
   * The text to display when the field value is an empty array.
   */
  arrayEmptyText?: string;
  /**
   * The options for the field.
   */
  options?: IOptionsForRadioAndSelect[];

  loadOptions?: boolean;

  /**
   * this is name for field in the form
   */
  foreignKey?: string;
  /**
   * this is value for field in the form
   * if value is equal to forenKeyValue then field is shown
   * if value is not equal to forenKeyValue then field is hidden
   */

  foreignKeyValue?: string;
  /**
   * this is value that must be removed from options in select
   */
  exclude?: string;

  multiLanguage?: boolean;

  /**
   * The id of the entity that is the source of the options.
   */

  selectorSourceId?: string;
  errorMessage?: string; // this is for the case when we have an error in the field or load options error
  displayInTable?: boolean;
}

export interface IOptionsForRadioAndSelect {
  value?: string; //for radio
  id?: string; // for select

  /**
   * The label of the option.
   */
  label?: string; //for radio
  name?: string; // for selecthooks
}

/**
 * Represents the options for the edit page of an item from the list.
 */
export interface IDataForEditPage {
  /**
   * The title of the edit page.
   */
  title: string[];
  /**
   * The page header of the edit page.
   */
  pageHeader?: string;
  /**
   * The sections of the edit page.
   */
  sections: {
    /**
     * The info of the section
     */
    info?: { title: string; text: string };
    /**
     * The title of the section.
     */
    title: string;
    /**
     * The fields in the section.
     */
    fields: IEditField[];

    /**
     * The button for the section.
     */
    button?: {
      title: string;
      label?: string;
      action: string;
      options?: IOptionsForActionDelete;
    };
  }[];

  /**
   * The title of the event that will be triggered when the data is saved in the edit page.
   */
  reloadEventTitle?: string;
  /**
   * The options for the buttons on the edit page.
   * default values are "Create" and "Update"
   */
  buttons?: {
    /**
     * The text for the "Create" button.
     */
    create?: string;
    /**
     * The text for the "Update" button.
     */
    update?: string;
  };
  buttonText?: {
    create?: string;
    update?: string;
  };
}

export interface IOptionsForActionDelete {
  modalText?: string;
  modalTitle?: string;
  confirmWord?: string;
  confirmText?: string;
  buttonTitle?: string;
}

export interface IconProjectsProps {
  stroked?: boolean | undefined;
  onClick?: (e: any) => void;
  className?: string;
}

export interface DataEntity {
  list: any[];
  loading: boolean;
}

export interface IEntitiesList {
  [key: string]: DataEntity;
}

export interface IEntityService<T> {
  deleteMany: (d: any) => Promise<any>;
  deleteOne: (d: string) => Promise<any>;
  updateOne: (id: string, body: any) => Promise<T>;
  createOne: (d: T) => Promise<T>;
  getOne: (d: string) => Promise<T>;
  getAll: () => Promise<T[]>;
}
