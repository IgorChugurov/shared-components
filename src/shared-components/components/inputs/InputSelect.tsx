import React, { useEffect, useState } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { MenuItem, Select } from "@mui/material";
import InputLabel from "./InputLabel";
import { error } from "console";

const isFormInvalid = (err: any) => {
  if (Object.keys(err).length > 0) return true;
  return false;
};
export const InputSelect = <T,>({
  options,
  name,
  label,
  placeholder,
  disabled,
  helperText,
  required,
  control,
  requiredText,
  className,
  loadOptions = false,
  style = {},
  containerClassName,
  errorMessage,
}: {
  options: T[];
  name: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  helperText?: string;
  required?: boolean;
  control: any;
  requiredText?: string;
  className?: string;
  loadOptions?: boolean;
  style?: any;
  containerClassName?: string;
  errorMessage?: string;
}) => {
  const {
    formState: { errors, isSubmitted },
    setError,
    clearErrors,
  } = useFormContext();
  //console.log("loadOptions", loadOptions, errorMessage);

  const [anchorEl, setAnchorEl] = useState(null);
  const inputErrors = findInputError(errors, name);
  const isInvalid = isFormInvalid(inputErrors);
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const [optioinsWithEmpty, setOptioinsWithEmpty] = useState<any[]>([
    { id: "none", name: placeholder || "select value" },
  ]);

  //console.log(optioinsWithEmpty);

  useEffect(() => {
    if (options) {
      const emptyOption = { id: "none", name: placeholder };
      setOptioinsWithEmpty([emptyOption, ...options]);
    }
  }, [options]);
  const selectedValue = useWatch({
    control,
    name,
    defaultValue: "none",
  });

  const handleMenuOpen = (event: any) => {
    setIsFocused(true);
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setIsFocused(false);
  };

  useEffect(() => {
    if (selectedValue === "none" && required && isSubmitted) {
      setError(name, {
        type: "manual",
        message: requiredText || "This field is required",
      });
    } else {
      clearErrors(name);
    }
  }, [selectedValue, required, isSubmitted]);

  return (
    <div className="input-container" style={{ ...style }}>
      {label && (
        <InputLabel
          label={label}
          options={{
            isInvalid,
            disabled,
            isFocused,
            isHovered,
            required,
          }}
        />
      )}

      {optioinsWithEmpty && optioinsWithEmpty.length > 0 && (
        <Controller
          name={name}
          defaultValue={"none"}
          control={control}
          render={({ field, fieldState: { error } }) => {
            return (
              <Select
                data-error={isInvalid}
                data-anchor={Boolean(anchorEl)}
                defaultValue={"none"}
                data-disabled={disabled}
                className={`custom_select ${disabled ? "disabled" : ""}`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                disabled={disabled}
                {...field}
                onOpen={handleMenuOpen}
                onClose={handleMenuClose}
                MenuProps={{
                  container:
                    containerClassName &&
                    document.querySelector(`.${containerClassName}`)
                      ? document.querySelector(`.${containerClassName}`)
                      : undefined,
                  anchorEl: anchorEl,
                  open: Boolean(anchorEl),
                  onClose: handleMenuClose,
                  PaperProps: {
                    className: `templateMenuPaper ${
                      className ? className : ""
                    }`,
                  },
                }}
                renderValue={(selValue) => {
                  const selectedOption = optioinsWithEmpty.find(
                    (option) => option && option.id === selValue
                  );
                  return (
                    <span
                      className={`menuItemText body-m-regular ${
                        disabled
                          ? "text-default-disabled"
                          : selectedOption && selectedOption.id !== "none"
                          ? "text-default"
                          : "text-secondary"
                      }`}
                    >
                      {selectedOption && selectedOption.name}
                    </span>
                  );
                }}
              >
                <MenuItem value="none" sx={{ display: "none !important" }}>
                  {placeholder || "Select value"}
                </MenuItem>
                {loadOptions ? (
                  <div className="loadingInSelect">
                    <span className="text-default body-m-regular">
                      Loading ...
                    </span>
                  </div>
                ) : errorMessage ? (
                  <div className="loadingInSelect">
                    <span className="text-error body-m-regular">
                      {errorMessage}
                    </span>
                  </div>
                ) : (
                  optioinsWithEmpty
                    .filter((option) => option.id !== "none")
                    .map(
                      (
                        r: {
                          id: string;
                          name: string;
                        },
                        i
                      ) => (
                        <MenuItem value={r.id} key={r.id} className="menuItem">
                          <span
                            className={[
                              "menuItemText",
                              "body-m-regular",
                              r.id === "none"
                                ? "text-secondary"
                                : "text-default",
                            ].join(" ")}
                          >
                            {r.name}
                          </span>
                        </MenuItem>
                      )
                    )
                )}
              </Select>
            );
          }}
        />
      )}

      {helperText && !isInvalid && (
        <span
          className="body-xs-regular colorSecondary"
          style={{ lineHeight: "12px" }}
        >
          {helperText}
        </span>
      )}

      {isInvalid && (
        <span
          className="body-xs-regular colorSystemError"
          style={{ lineHeight: "12px" }}
        >
          {inputErrors?.error?.message}
        </span>
      )}
    </div>
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
