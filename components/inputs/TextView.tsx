import { useFormContext } from "react-hook-form";
import { useState } from "react";
import InputLabel from "./InputLabel";
import styles from "./TextView.module.css";
const isFormInvalid = (err: any) => {
  if (Object.keys(err).length > 0) return true;
  return false;
};

export const TextView = ({
  name,
  label,
  placeholder,
  disabled,
  helperText,
  required,
  value,
}: {
  name: string;
  label?: string;

  placeholder?: string;
  disabled?: boolean;
  helperText?: string;
  required?: boolean;
  value: string;
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const inputErrors = findInputError(errors, name);
  const isInvalid = isFormInvalid(inputErrors);
  const items = []; // Add this line to define the 'items' variable.

  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className={styles.container}>
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
      <span
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`body-s-regular text-default`}
        style={{
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {value}
      </span>

      {helperText && !isInvalid && (
        <span
          className="body-xs-regular text-econdary"
          style={{ lineHeight: "12px" }}
        >
          {helperText}
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
