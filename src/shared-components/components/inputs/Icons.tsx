export const Icon_copy = ({
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
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="currentColor"
      onClick={handleClick}
      className={className}
    >
      <mask
        id="mask0_2726_20513"
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="16"
        height="16"
      >
        <rect width="16" height="16" fill="#D9D9D9" />
      </mask>
      <g mask="url(#mask0_2726_20513)">
        <path d="M6 11.9999C5.63333 11.9999 5.31944 11.8694 5.05833 11.6083C4.79722 11.3471 4.66667 11.0333 4.66667 10.6666V2.66659C4.66667 2.29992 4.79722 1.98603 5.05833 1.72492C5.31944 1.46381 5.63333 1.33325 6 1.33325H12C12.3667 1.33325 12.6806 1.46381 12.9417 1.72492C13.2028 1.98603 13.3333 2.29992 13.3333 2.66659V10.6666C13.3333 11.0333 13.2028 11.3471 12.9417 11.6083C12.6806 11.8694 12.3667 11.9999 12 11.9999H6ZM6 10.6666H12V2.66659H6V10.6666ZM3.33333 14.6666C2.96667 14.6666 2.65278 14.536 2.39167 14.2749C2.13056 14.0138 2 13.6999 2 13.3333V3.99992H3.33333V13.3333H10.6667V14.6666H3.33333Z" />
      </g>
    </svg>
  );
};
export const Icon_radio_input = ({
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
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="currentColor"
      onClick={handleClick}
      className={className}
    >
      <circle cx="10" cy="10" r="10" />
      <path
        d="M9.99967 15.6673C13.1293 15.6673 15.6663 13.1303 15.6663 10.0007C15.6663 6.87104 13.1293 4.33398 9.99967 4.33398C6.87006 4.33398 4.33301 6.87104 4.33301 10.0007C4.33301 13.1303 6.87006 15.6673 9.99967 15.6673Z"
        stroke="white"
        strokeWidth="3"
      />
    </svg>
  );
};
