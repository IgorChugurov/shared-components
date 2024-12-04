/**
 * Options for radio buttons and select fields
 */
export interface IOptionsForRadioAndSelect {
  /** Value for radio buttons */
  value?: string;

  /** ID for select fields */
  id?: string;

  /** Label text for radio buttons */
  label?: string;

  /** Name for select fields */
  name?: string;
}

/**
 * Configuration for a field in edit/create forms
 */
export interface IEditField {
  /** Field identifier */
  name: string;

  /** Display label */
  label?: string;

  /** Placeholder text */
  placeholder?: string;

  /** Field input type */
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

  /** Backend collection name */
  collectionName?: string;

  /** Help text shown below field */
  helperText?: string;

  /** Whether field allows multiple values */
  multipile?: boolean;

  /** Field visibility on edit page */
  forEditPage?: "yes" | "no" | string;

  /** Field visibility on create page */
  forCreatePage?: "yes" | "no" | string;

  /** Whether field is required */
  required?: boolean;

  /** Whether field is disabled on edit page */
  forEditPageDisabled?: boolean;

  /** Custom required validation message */
  requiredText?: string;

  /** Custom min value validation message */
  minValueText?: string;

  /** Custom max value validation message */
  maxValueText?: string;

  /** Message shown for empty arrays */
  arrayEmptyText?: string;

  /** Options for radio/select fields */
  options?: IOptionsForRadioAndSelect[];

  /** Whether to dynamically load options */
  loadOptions?: boolean;

  /** Foreign key field name */
  foreignKey?: string;

  /** Required foreign key value */
  foreignKeyValue?: string;

  /** Values to exclude from options */
  exclude?: string;

  /** Whether field supports multiple languages */
  multiLanguage?: boolean;

  /** ID of entity providing options */
  selectorSourceId?: string;

  /** Error message */
  errorMessage?: string;

  /** Show in table view */
  displayInTable?: boolean;
}
