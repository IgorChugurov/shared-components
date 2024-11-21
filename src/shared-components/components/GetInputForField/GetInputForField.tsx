import React from "react";
import { IEditField } from "../../types/appdata";
import { InputText } from "../inputs/InputText";
import { InputSelect } from "../inputs/InputSelect";
import { InputSwitch } from "../inputs/InputSwitch";
import { InputRadio } from "../inputs/InputRadio";
import { InputMultipleSelect } from "../inputs/InputMultipleSelect";

const GetInputForField = ({
  field,
  control,
  currentItem,
}: {
  field: IEditField;
  control: any;
  currentItem: any;
}) => {
  return (
    <>
      {field.type === "select" ? (
        <InputSelect
          {...field}
          control={control}
          disabled={Boolean(currentItem.id && field.forEditPageDisabled)}
          options={field.options || []}
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
          options={field.options || []}
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
