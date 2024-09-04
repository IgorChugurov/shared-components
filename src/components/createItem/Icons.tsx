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
export const Icon_info: React.FC<IconProjectsProps> = ({
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
      <mask
        id="mask0_557_3685"
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="16"
        height="16"
      >
        <rect width="16" height="16" fill="#D9D9D9" />
      </mask>
      <g mask="url(#mask0_557_3685)">
        <path
          d="M7.3335 11.3334H8.66683V7.33337H7.3335V11.3334ZM8.00016 6.00004C8.18905 6.00004 8.34739 5.93615 8.47516 5.80837C8.60294 5.6806 8.66683 5.52226 8.66683 5.33337C8.66683 5.14449 8.60294 4.98615 8.47516 4.85837C8.34739 4.7306 8.18905 4.66671 8.00016 4.66671C7.81127 4.66671 7.65294 4.7306 7.52516 4.85837C7.39739 4.98615 7.3335 5.14449 7.3335 5.33337C7.3335 5.52226 7.39739 5.6806 7.52516 5.80837C7.65294 5.93615 7.81127 6.00004 8.00016 6.00004ZM8.00016 14.6667C7.07794 14.6667 6.21127 14.4917 5.40016 14.1417C4.58905 13.7917 3.8835 13.3167 3.2835 12.7167C2.6835 12.1167 2.2085 11.4112 1.8585 10.6C1.5085 9.78893 1.3335 8.92226 1.3335 8.00004C1.3335 7.07782 1.5085 6.21115 1.8585 5.40004C2.2085 4.58893 2.6835 3.88337 3.2835 3.28337C3.8835 2.68337 4.58905 2.20837 5.40016 1.85837C6.21127 1.50837 7.07794 1.33337 8.00016 1.33337C8.92239 1.33337 9.78905 1.50837 10.6002 1.85837C11.4113 2.20837 12.1168 2.68337 12.7168 3.28337C13.3168 3.88337 13.7918 4.58893 14.1418 5.40004C14.4918 6.21115 14.6668 7.07782 14.6668 8.00004C14.6668 8.92226 14.4918 9.78893 14.1418 10.6C13.7918 11.4112 13.3168 12.1167 12.7168 12.7167C12.1168 13.3167 11.4113 13.7917 10.6002 14.1417C9.78905 14.4917 8.92239 14.6667 8.00016 14.6667Z"
          fill="#0969DA"
        />
      </g>
    </svg>
  );
};
