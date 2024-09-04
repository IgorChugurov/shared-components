import { useEffect, useRef, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Box, Checkbox, MenuItem, Select } from "@mui/material";
import InputLabel from "./InputLabel";

const isFormInvalid = (err: any) => {
  if (Object.keys(err).length > 0) return true;
  return false;
};
export const InputMultipleSelect = <T,>({
  options,
  name,
  label,
  placeholder,
  IconFirstComponent,
  disabled,
  helperText,
  required,
  control,
}: {
  options: T & { name: string }[];
  name: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  helperText?: string;
  required?: boolean;
  IconFirstComponent?: any;
  control: any;
}) => {
  const {
    formState: { errors },
  } = useFormContext();

  const selectRef = useRef(null);
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
      <div className="inputBox">
        {optioinsWithEmpty && optioinsWithEmpty.length > 0 && (
          <Controller
            name={name}
            defaultValue={"none"}
            control={control}
            render={({ field, fieldState: { error } }) => {
              return (
                <Box ref={selectRef} sx={{ width: "100%" }}>
                  <Select
                    data-error={isInvalid}
                    data-anchor={Boolean(anchorEl)}
                    data-disabled={disabled}
                    className={`custom_select ${disabled ? "disabled" : ""}`}
                    multiple
                    displayEmpty
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
                        sx: { maxHeight: "300px", marginTop: "-8px" },
                      },
                    }}
                    renderValue={(selected) => {
                      const selectedItems = selected as string[];
                      return (
                        <>
                          {selectedItems.length > 0 ? (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                flex: "1 0 0",
                                justifyContent: "flex-start",
                                whiteSpace: "wrap",
                              }}
                            >
                              {selectedItems.map((comp, i) => (
                                <span
                                  key={comp}
                                  className="body-s-regular text-secondary menuItemText"
                                >
                                  {options.find((c: any) => c.id === comp)
                                    ?.name ?? ""}
                                  {i !== selectedItems.length - 1 && (
                                    <span>,</span>
                                  )}
                                </span>
                              ))}
                            </Box>
                          ) : (
                            <span className="body-s-regular text-secondary menuItemText">
                              {placeholder}
                            </span>
                          )}
                        </>
                      );
                    }}
                  >
                    {optioinsWithEmpty.map((r, i) => (
                      <MenuItem
                        className="menuItem"
                        value={r.id}
                        key={r.id}
                        disabled={Boolean(r.division === "YES")}
                        sx={{
                          display: r.id === "none" ? "none !important" : "flex",
                          "&.MuiButtonBase-root.MuiMenuItem-root.Mui-focusVisible":
                            {
                              backgroundColor: "var(--background-gray-default)",
                            },
                          "&.Mui-selected": {
                            backgroundColor:
                              "var(--background-primary-tertiary)",
                          },
                        }}
                      >
                        {r.division === "YES" ? (
                          <>
                            <span
                              className={[
                                "menuItemText",
                                "body-s-regular",
                                "text-secondary",
                              ].join(" ")}
                            >
                              {r.name}
                            </span>
                          </>
                        ) : (
                          <>
                            <Checkbox
                              size="small"
                              checked={field.value.indexOf(r.id) > -1}
                            />
                            <span
                              className={[
                                "menuItemText",
                                "body-s-regular",
                                r.id === "none"
                                  ? "text-secondary"
                                  : "text-default",
                              ].join(" ")}
                            >
                              {r.name}
                            </span>
                          </>
                        )}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
              );
            }}
          />
        )}

        {helperText && !isInvalid && (
          <span
            className="body-xs-regular text-secondary"
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
