import { IEditField } from "../types/appdata";
export const removeNoneOptions = (obj: any, allFields: IEditField[]) => {
  //console.log(obj, allFields);
  allFields.forEach((field) => {
    if (field.type === "select" && obj[field.name] === "none") {
      delete obj[field.name];
    }
  });
  return { ...obj };
};
