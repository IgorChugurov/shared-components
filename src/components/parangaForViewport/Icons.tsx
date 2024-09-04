export const Icon_loader = ({
  onClick,
  className,
}: {
  onClick?: (e: any) => void;
  className?: string;
}) => {
  const handleClick = (e: React.MouseEvent<SVGElement>) => {
    if (onClick) {
      onClick(e);
    }
  };
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="38"
      height="37"
      viewBox="0 0 38 37"
      fill="none"
      className={className}
    >
      <circle
        cx="21.5883"
        cy="8.71186"
        r="5"
        transform="rotate(15 21.5883 8.71186)"
        fill="var(--background-primary-secondary-hover, #d0cee4)"
      />
      <circle
        cx="16.4105"
        cy="28.0305"
        r="5"
        transform="rotate(15 16.4105 28.0305)"
        fill="var(--border-primary-default-hovered, #75649d)"
      />
      <circle
        cx="28.6586"
        cy="20.9594"
        r="5"
        transform="rotate(15 28.6586 20.9594)"
        fill="var(--background-primary-tertiary-hover, #b7b1d4)"
      />
      <circle
        cx="9.34022"
        cy="15.7829"
        r="5"
        transform="rotate(15 9.34022 15.7829)"
        fill="var(--background-primary-tertiary, #e5e4f0)"
      />
    </svg>
  );
};
