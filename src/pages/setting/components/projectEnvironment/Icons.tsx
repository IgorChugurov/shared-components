interface IconProjectsProps {
  onClick?: (e: any) => void;
  className?: string;
}
export const Icon_add: React.FC<IconProjectsProps> = ({
  onClick,
  className,
}) => {
  const handleClick = (e: React.MouseEvent<SVGElement>) => {
    e.stopPropagation();
    if (onClick) {
      onClick(e);
    }
  };
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="currentColor"
      onClick={handleClick}
      className={className}
    >
      <path d="M12.6668 8.66659H8.66683V12.6666H7.3335V8.66659H3.3335V7.33325H7.3335V3.33325H8.66683V7.33325H12.6668V8.66659Z" />
    </svg>
  );
};
