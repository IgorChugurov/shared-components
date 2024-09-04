import { Controller, useFormContext } from "react-hook-form";
import { useState } from "react";
import InputLabel from "./InputLabel";
import { IOptionsForRadioAndSelect } from "../../types/appdata";
import { Icon_radio_input } from "./Icons";

const isFormInvalid = (err: any) => {
  if (Object.keys(err).length > 0) return true;
  return false;
};

export const InputRadio = ({
  name,
  label,
  type,
  placeholder,
  options,
  disabled,
  helperText,
  required,
  control,
}: {
  name: string;
  label?: string;
  type?: string;
  placeholder?: string;
  options?: IOptionsForRadioAndSelect[];
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
  // if (type === "radio") {
  //   console.log(isFocused);
  // }
  return (
    <div className="input-container-radio">
      {label && (
        <InputLabel
          label={label}
          options={{
            isInvalid,
            disabled,
            isFocused: false,
            isHovered,
            required,
          }}
        />
      )}
      <div
        className="input-radio-wrapper"
        onFocus={() => setIsFocused(true)}
        // onBlur={() => {
        //   setIsFocused(false);
        // }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setIsFocused(false);
        }}
      >
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <>
              {options &&
                options.map((option, index) => (
                  <label
                    key={index}
                    className={`input-radio-label ${
                      disabled ? "disabled" : ""
                    } ${field.value === option.value ? "active" : ""}`}
                  >
                    {field.value === option.value ? (
                      <Icon_radio_input className="input-radio-icon" />
                    ) : (
                      <input
                        className="input-radio"
                        type="radio"
                        value={option.value}
                        checked={field.value === option.value}
                        onChange={field.onChange}
                        disabled={disabled}
                      />
                    )}
                    <span className="body-m-regular">{option.label}</span>
                  </label>
                ))}
            </>
          )}
        />
      </div>

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
