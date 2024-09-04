import { useEffect, useRef, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Box, MenuItem, Select } from "@mui/material";
import InputLabel from "./InputLabel";

const isFormInvalid = (err: any) => {
  if (Object.keys(err).length > 0) return true;
  return false;
};
export const InputSelectWithoutLabel = <T,>({
  options,
  name,

  placeholder,

  disabled,
  helperText,
  required,
  control,
}: {
  options: T[];
  name: string;

  placeholder?: string;
  disabled?: boolean;
  helperText?: string;
  required?: boolean;

  control: any;
}) => {
  const {
    formState: { errors },
  } = useFormContext();

  const [anchorEl, setAnchorEl] = useState(null);
  const inputErrors = findInputError(errors, name);
  const isInvalid = isFormInvalid(inputErrors);
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const [optioinsWithEmpty, setOptioinsWithEmpty] = useState<any[]>([]);
  useEffect(() => {
    if (options && options.length > 0) {
      const emptyOption = { id: "none", name: placeholder };
      setOptioinsWithEmpty([emptyOption, ...options]);
    }
  }, [options]);

  const handleMenuOpen = (event: any) => {
    setIsFocused(true);
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setIsFocused(false);
  };

  return (
    <div className="input-container">
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
                data-disabled={disabled}
                className={`custom_select ${disabled ? "disabled" : ""}`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                disabled={disabled}
                {...field}
                onOpen={handleMenuOpen}
                onClose={handleMenuClose}
                MenuProps={{
                  anchorEl: anchorEl,
                  open: Boolean(anchorEl),
                  onClose: handleMenuClose,
                  PaperProps: {
                    className: "menuPaper",
                    sx: { marginTop: "12px", maxHeight: "300px" },
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
                {optioinsWithEmpty.map(
                  (
                    r: {
                      id: string;
                      name: string;
                    },
                    i
                  ) => (
                    <MenuItem
                      value={r.id}
                      key={r.id}
                      className="menuItem"
                      sx={{
                        display: r.id === "none" ? "none !important" : "flex",
                      }}
                    >
                      <span
                        className={[
                          "menuItemText",
                          "body-m-regular",
                          r.id === "none" ? "text-secondary" : "text-default",
                        ].join(" ")}
                      >
                        {r.name}
                      </span>
                    </MenuItem>
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
