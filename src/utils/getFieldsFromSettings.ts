import { IEditField } from "../types/appdata";

export const getFieldsFromEnvironmentValues = (
  settings: any
): (IEditField & { description: string })[] => {
  if (settings?.items) {
    return settings.items.map((item: any) => {
      return {
        name: item.id,
        label: item.label,
        type: item.valueType === "boolean" ? "switch" : item.valueType,
        value: item.value,
        options: item.options,
        placeholder: item.placeholder,
        description: item.description,
      };
    });
  }

  return [];
};
export const getItemFromEnvironmentValues = (settings: any): any => {
  const item = settings?.items.reduce(
    (acc: any, item: any) => {
      acc[item.id] = item.value;
      return acc;
    },
    { id: settings.id }
  );

  return item;
};
