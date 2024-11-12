import React, { useContext } from "react";
import { IEditField } from "../../types/appdata";
import { GlobalStateContext } from "../../context/GlobalStateProvider";
import { InputText } from "../inputs/InputText";
import { InputSelect } from "../inputs/InputSelect";
import { InputSwitch } from "../inputs/InputSwitch";
import { InputRadio } from "../inputs/InputRadio";
import { InputMultipleSelect } from "../inputs/InputMultipleSelect";
import InputLexical from "../InputLexical/InputLexical";
const GetInputForField = ({
  field,
  control,
  parentEntityId,
  currentItem,
}: {
  field: IEditField;
  control: any;
  parentEntityId?: string;
  currentItem: any;
}) => {
  const { darkMode, entitiesList, renewData } = useContext(GlobalStateContext);
  const getOptions = (field: IEditField) => {
    if (field.options && field.options.length) {
      // Если у поля уже есть заданные опции, возвращаем их
      return field.options;
    }

    if (field.collectionName && entitiesList[field.collectionName]) {
      return entitiesList[field.collectionName].list.filter((item) => {
        if (field.exclude && parentEntityId && item.id === parentEntityId) {
          return false;
        }
        return true;
      });
    }
    return [];
  };

  return (
    <>
      {field.type === "select" ? (
        <InputSelect
          {...field}
          control={control}
          disabled={Boolean(currentItem.id && field.forEditPageDisabled)}
          options={getOptions(field)}
        />
      ) : field.type === "switch" ? (
        <InputSwitch
          {...field}
          control={control}
          disabled={Boolean(currentItem.id && field.forEditPageDisabled)}
        />
      ) : field.type === "radio" ? (
        <InputRadio
          {...field}
          control={control}
          disabled={Boolean(currentItem.id && field.forEditPageDisabled)}
        />
      ) : field.type === "array" ? (
        <InputMultipleSelect
          disabled={Boolean(currentItem.id && field.forEditPageDisabled)}
          {...field}
          control={control}
          options={
            field.collectionName && entitiesList[field.collectionName]
              ? entitiesList[field.collectionName].list
              : []
          }
        />
      ) : field.type === "multipleSelect" ? (
        <InputLexical
          disabled={Boolean(currentItem.id && field.forEditPageDisabled)}
          {...field}
          control={control}
        />
      ) : (
        <InputText
          {...field}
          disabled={Boolean(currentItem.id && field.forEditPageDisabled)}
        />
      )}
    </>
  );
};

export default GetInputForField;
