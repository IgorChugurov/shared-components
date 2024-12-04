import React, { useState } from "react";
import PropTypes from "prop-types";

const CustomSwitch = ({
  checked,
  onChange,
  disabled,
  name,
  onFocus,
  onBlur,
  onMouseEnter,
  onMouseLeave,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled: boolean;
  name: string;
  onFocus: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  onMouseEnter: (e: React.MouseEvent<HTMLInputElement>) => void;
  onMouseLeave: (e: React.MouseEvent<HTMLInputElement>) => void;
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLInputElement>) => {
    setIsHovered(true);
    if (onMouseEnter) onMouseEnter(e);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLInputElement>) => {
    setIsHovered(false);
    if (onMouseLeave) onMouseLeave(e);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) onChange(e.target.checked);
  };

  return (
    <label
      className={`custom-switch ${isFocused ? "focused" : ""} ${
        isHovered ? "hovered" : ""
      } ${disabled ? "disabled" : ""}`}
    >
      <input
        type="checkbox"
        checked={checked}
        name={name}
        onChange={handleChange}
        disabled={disabled}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="custom-switch-input"
      />
      <span className="custom-switch-slider" />
    </label>
  );
};

CustomSwitch.propTypes = {
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
};

export default CustomSwitch;
