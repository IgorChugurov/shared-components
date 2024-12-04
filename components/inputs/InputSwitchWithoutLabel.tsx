import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Switch } from "@mui/material";
import InputLabel from "./InputLabel";
import CustomSwitch from "./CustomSwitch";

const isFormInvalid = (err: any) => {
  if (Object.keys(err).length > 0) return true;
  return false;
};
export const InputSwitchWithoutLabel = ({
  name,
  label,
  placeholder,

  disabled = false,
  helperText,
  required,
  control,
}: {
  name: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  helperText?: string;
  required?: boolean;

  control: any;
}) => {
  const {
    formState: { errors },
  } = useFormContext();

  const inputErrors = findInputError(errors, name);
  const isInvalid = isFormInvalid(inputErrors);
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => {
          return (
            <CustomSwitch
              className="input-switch"
              checked={field.value}
              onChange={field.onChange}
              name={field.name}
              disabled={disabled}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            />
          );
        }}
      />

      {helperText && !isInvalid && (
        <span
          className="body-s-regular text-secondary"
          style={{ lineHeight: "12px" }}
        >
          {helperText}
        </span>
      )}

      {isInvalid && (
        <span
          className="body-s-regular colorSystemError"
          style={{ lineHeight: "12px" }}
        >
          {inputErrors?.error?.message}
        </span>
      )}
    </>
  );
};

function findInputError(errors: any, name: string) {
  const filtered: any = Object.keys(errors)
    .filter((key) => key.includes(name))
    .reduce((cur, key) => {
      return Object.assign(cur, { error: errors[key] });
    }, {});
  return filtered;
}
