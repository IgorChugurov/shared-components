const InputLabel = ({
  options,
  label,
}: {
  label: string;
  options: {
    isInvalid: boolean;
    disabled?: boolean;
    isFocused: boolean;
    isHovered: boolean;
    required?: boolean;
  };
}) => {
  const { isInvalid, disabled, isFocused, isHovered, required } = options;
  const labelColor = isInvalid
    ? "var(--text-error-default)"
    : disabled
    ? "var(--text-gray-default-disabled)"
    : isFocused
    ? "var(--text-primary-default)"
    : isHovered
    ? "var(--text-gray-secondary)"
    : "var(--text-gray-default-disabled)";
  return (
    <div className={`labelWrapper`}>
      <span
        className={`inputLabel ${isInvalid ? "error" : ""}`}
        style={{ color: labelColor }}
      >
        {label}
      </span>
      {required && <span className="body-s-medium colorSystemError ">*</span>}
    </div>
  );
};

export default InputLabel;
