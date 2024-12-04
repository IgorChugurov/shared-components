import { IconProjectsProps } from "@src/types/icons";

export const Icon_attach_file: React.FC<IconProjectsProps> = ({ onClick, className }) => {
  const handleClick = (e: React.MouseEvent<SVGElement>) => {
    if (onClick) {
      onClick(e);
    }
  };
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="currentColor"
      onClick={handleClick}
      className={className}
    >
      <mask id="mask0_2242_852" maskUnits="userSpaceOnUse" x="0" y="0" width="12" height="12">
        <rect width="12" height="12" fill="#D9D9D9" />
      </mask>
      <g mask="url(#mask0_2242_852)">
        <path d="M9 7.875C9 8.74167 8.69583 9.47917 8.0875 10.0875C7.47917 10.6958 6.74167 11 5.875 11C5.00833 11 4.27083 10.6958 3.6625 10.0875C3.05417 9.47917 2.75 8.74167 2.75 7.875V3.25C2.75 2.625 2.96875 2.09375 3.40625 1.65625C3.84375 1.21875 4.375 1 5 1C5.625 1 6.15625 1.21875 6.59375 1.65625C7.03125 2.09375 7.25 2.625 7.25 3.25V7.625C7.25 8.00833 7.11667 8.33333 6.85 8.6C6.58333 8.86667 6.25833 9 5.875 9C5.49167 9 5.16667 8.86667 4.9 8.6C4.63333 8.33333 4.5 8.00833 4.5 7.625V3H5.5V7.625C5.5 7.73333 5.53542 7.82292 5.60625 7.89375C5.67708 7.96458 5.76667 8 5.875 8C5.98333 8 6.07292 7.96458 6.14375 7.89375C6.21458 7.82292 6.25 7.73333 6.25 7.625V3.25C6.24167 2.9 6.11875 2.60417 5.88125 2.3625C5.64375 2.12083 5.35 2 5 2C4.65 2 4.35417 2.12083 4.1125 2.3625C3.87083 2.60417 3.75 2.9 3.75 3.25V7.875C3.74167 8.46667 3.94583 8.96875 4.3625 9.38125C4.77917 9.79375 5.28333 10 5.875 10C6.45833 10 6.95417 9.79375 7.3625 9.38125C7.77083 8.96875 7.98333 8.46667 8 7.875V3H9V7.875Z" />
      </g>
    </svg>
  );
};
export const Icon_close: React.FC<IconProjectsProps> = ({ onClick, className }) => {
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
      <mask id="mask0_2059_7246" maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="#D9D9D9" />
      </mask>
      <g mask="url(#mask0_2059_7246)">
        <path d="M4.26659 12.6663L3.33325 11.733L7.06659 7.99967L3.33325 4.26634L4.26659 3.33301L7.99992 7.06634L11.7333 3.33301L12.6666 4.26634L8.93325 7.99967L12.6666 11.733L11.7333 12.6663L7.99992 8.93301L4.26659 12.6663Z" />
      </g>
    </svg>
  );
};
