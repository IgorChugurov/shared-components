import { IEditField } from "../types/appdata";

export const getItemForEdit = <T>(
  allFields: IEditField[],
  currentItem?: T,
  projectSettings?: { languages: string[]; defaultLang: string }
) => {
  const { languages, defaultLang } = projectSettings || {
    languages: ["en"],
    defaultLang: "en",
  };
  let data = allFields.reduce((acc: any, field: any) => {
    if (field.multiLanguage) {
      acc[`${field.name}_${defaultLang}`] = "";
      languages.forEach((lang) => {
        if (lang !== defaultLang) {
          acc[`${field.name}_${lang}`] = "";
        }
      });
    } else {
      acc[field.name] =
        field.type === "number"
          ? 0
          : field.type === "boolean"
          ? false
          : field.type === "select"
          ? "none"
          : field.type === "switch"
          ? true
          : field.type === "radio"
          ? field.options[0].value
          : field.type === "array"
          ? []
          : "";
    }

    return acc;
  }, {});

  if (currentItem) {
    const dataFromServer: any = {
      ...JSON.parse(JSON.stringify(currentItem)),
    };
    allFields.forEach((field) => {
      if (field.type === "select" && dataFromServer[field.name] === null) {
        dataFromServer[field.name] = "none";
      }

      if (field.multiLanguage) {
        // dataFromServer[field.name].forEach(
        //   (langData: { code: string; value: string }) => {
        //     if (languages.includes(langData.code)) {
        //       dataFromServer[`${field.name}_${langData.code}`] = langData.value;
        //     }
        //   }
        // );
        // todo his is the part that needs to be removed

        dataFromServer[`${field.name}_${defaultLang}`] =
          dataFromServer[field.name];
        languages.forEach((lang) => {
          if (lang !== defaultLang) {
            dataFromServer[`${field.name}_${lang}`] = "";
          }
        });
      }
    });
    data = { ...data, ...dataFromServer };
  }
  return data;
};

export const getFieldsWithProjectSettings = (
  allFields: IEditField[],
  projectSettings: { languages: string[]; defaultLang: string }
): IEditField[] => {
  const { languages, defaultLang } = projectSettings || {
    languages: ["en"],
    defaultLang: "en",
  };
  const data = allFields.reduce((acc, field) => {
    if (field.multiLanguage) {
      acc.push({
        ...field,
        name: `${field.name}_${defaultLang}`,
        label: `${field.label} (${defaultLang})`,
      });
      languages.forEach((lang) => {
        if (lang !== defaultLang) {
          acc.push({
            ...field,
            name: `${field.name}_${lang}`,
            label: `${field.label} (${lang})`,
          });
        }
      });
    } else {
      acc.push(field);
    }
    return acc;
  }, [] as IEditField[]);
  return data;

  // return allFields.reduce((acc: IEditField[], field) => {
  //   if (field.multiLanguage && field.type === "text") {
  //     return {
  //       ...field,
  //       name: `${field.name}_${defaultLang}`,
  //       label: `${field.label} (${defaultLang})`,
  //     };
  //   }
  //   return acc;
  // }, [] as IEditField[]);
};
