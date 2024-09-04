export interface IField {
  id: string;
  name: string;
  type:
    | "select"
    | "text"
    | "textarea"
    | "number"
    | "date"
    | "boolean"
    | "radio"
    | "multipleSelect";
  selectorSourceId: string;
  label: string;
  placeholder: string;
  description?: string;
  forEditPage: boolean;
  forCreatePage: boolean;
  required: boolean;
  requiredText?: string;
  forEditPageDisabled: boolean;
  entityDefinitionId: string;
  multiLanguage: boolean;
}
