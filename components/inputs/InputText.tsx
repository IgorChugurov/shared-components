import { useFormContext } from "react-hook-form";
import { useState } from "react";
import InputLabel from "./InputLabel";
const isFormInvalid = (err: any) => {
  if (Object.keys(err).length > 0) return true;
  return false;
};

export const InputText = ({
  name,
  label,
  type,
  placeholder,
  multiline,
  disabled,
  helperText,
  required,
}: {
  name: string;
  label?: string;
  type: string;
  placeholder?: string;
  multiline?: boolean;
  disabled?: boolean;
  helperText?: string;
  required?: boolean;
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const inputErrors = findInputError(errors, name);
  const isInvalid = isFormInvalid(inputErrors);

  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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
        {multiline || type === "textarea" ? (
          <textarea
            data-error={isInvalid}
            disabled={disabled}
            placeholder={placeholder}
            autoComplete="new-password"
            {...register(name)}
            {...{ meta: { autocomplete: "off" } }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          />
        ) : (
          <input
            type={type}
            data-error={isInvalid}
            disabled={disabled}
            placeholder={placeholder}
            autoComplete="new-password"
            {...register(name)}
            {...{ meta: { autocomplete: "off" } }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          />
        )}
      </div>
      {helperText && !isInvalid && (
        <span className="helper-text" style={{ lineHeight: "12px" }}>
          {helperText}
        </span>
      )}

      {isInvalid && (
        <span className="error-text" style={{ lineHeight: "12px" }}>
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
