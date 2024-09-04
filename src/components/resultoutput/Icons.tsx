interface IconProjectsProps {
  stroked?: boolean | undefined;
  onClick?: (e: any) => void;
  className?: string;
}
export const Icon_close: React.FC<IconProjectsProps> = ({
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
      <path
        d="M8.97398 8L12.6673 11.6933V12.6667H11.694L8.00065 8.97334L4.30732 12.6667H3.33398V11.6933L7.02732 8L3.33398 4.30667V3.33334H4.30732L8.00065 7.02667L11.694 3.33334H12.6673V4.30667L8.97398 8Z"
        fill="#262626"
      />
    </svg>
  );
};
export const Icon_check_circle: React.FC<IconProjectsProps> = ({
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
        id="mask0_328_2868"
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="16"
        height="16"
      >
        <rect width="16" height="16" fill="#D9D9D9" />
      </mask>
      <g mask="url(#mask0_328_2868)">
        <path d="M7.06732 11.0667L11.7673 6.36667L10.834 5.43334L7.06732 9.2L5.16732 7.3L4.23398 8.23334L7.06732 11.0667ZM8.00065 14.6667C7.07843 14.6667 6.21176 14.4917 5.40065 14.1417C4.58954 13.7917 3.88398 13.3167 3.28398 12.7167C2.68398 12.1167 2.20898 11.4111 1.85898 10.6C1.50898 9.78889 1.33398 8.92222 1.33398 8C1.33398 7.07778 1.50898 6.21111 1.85898 5.4C2.20898 4.58889 2.68398 3.88334 3.28398 3.28334C3.88398 2.68334 4.58954 2.20834 5.40065 1.85834C6.21176 1.50834 7.07843 1.33334 8.00065 1.33334C8.92287 1.33334 9.78954 1.50834 10.6007 1.85834C11.4118 2.20834 12.1173 2.68334 12.7173 3.28334C13.3173 3.88334 13.7923 4.58889 14.1423 5.4C14.4923 6.21111 14.6673 7.07778 14.6673 8C14.6673 8.92222 14.4923 9.78889 14.1423 10.6C13.7923 11.4111 13.3173 12.1167 12.7173 12.7167C12.1173 13.3167 11.4118 13.7917 10.6007 14.1417C9.78954 14.4917 8.92287 14.6667 8.00065 14.6667Z" />
      </g>
    </svg>
  );
};
