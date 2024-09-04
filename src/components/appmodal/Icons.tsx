interface IconProjectsProps {
  stroked?: boolean | undefined;
  onClick?: (e: any) => void;
  className?: string;
}

export const Icon_window_close: React.FC<IconProjectsProps> = ({
  onClick,
  className,
}) => {
  const handleClick = (e: React.MouseEvent<SVGElement>) => {
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
      <path d="M8.9735 8.00004L12.6668 11.6934V12.6667H11.6935L8.00016 8.97337L4.30683 12.6667H3.3335V11.6934L7.02683 8.00004L3.3335 4.30671V3.33337H4.30683L8.00016 7.02671L11.6935 3.33337H12.6668V4.30671L8.9735 8.00004Z" />
    </svg>
  );
};
