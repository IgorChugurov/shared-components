interface IconProjectsProps {
  onClick?: (e: any) => void;
  className?: string;
  size?: string;
}

export const Icon_Logo: React.FC<IconProjectsProps> = ({
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
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="currentColor"
      onClick={handleClick}
      className={className}
    >
      <path
        d="M15.7006 7L10 12.6035H12.8344V19.0522C12.8344 21.1809 13.4183 22.7043 14.586 23.6226C15.7537 24.5409 17.5584 25 20 25V22.3704C19.3843 22.3704 18.8641 22.3391 18.4395 22.2765C18.0361 22.2139 17.6008 22.0887 17.1338 21.9009C16.6667 21.6922 16.3057 21.3478 16.051 20.8678C15.8174 20.3878 15.7006 19.7826 15.7006 19.0522V12.6035H20V9.97391H15.7006V7Z"
        fill="#262626"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M32 16C32 24.8366 24.8366 32 16 32C7.16344 32 0 24.8366 0 16C0 7.16344 7.16344 0 16 0C24.8366 0 32 7.16344 32 16ZM30 16C30 23.732 23.732 30 16 30C8.26801 30 2 23.732 2 16C2 8.26801 8.26801 2 16 2C23.732 2 30 8.26801 30 16Z"
        fill="#262626"
      />
    </svg>
  );
};
export const Icon_Plus: React.FC<IconProjectsProps> = ({
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
      onClick={handleClick}
      className={className}
      fill="currentColor"
    >
      <mask
        id="mask0_136_165"
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="16"
        height="16"
      >
        <rect width="16" height="16" fill="#D9D9D9" />
      </mask>
      <g mask="url(#mask0_136_165)">
        <path
          d="M7.3335 8.66667H3.3335V7.33334H7.3335V3.33334H8.66683V7.33334H12.6668V8.66667H8.66683V12.6667H7.3335V8.66667Z"
          fill="white"
        />
      </g>
    </svg>
  );
};
export const Icon_Setting: React.FC<IconProjectsProps> = ({
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
      onClick={handleClick}
      className={className}
      fill="currentColor"
    >
      <path d="M6.44385 1.33333L6.11702 3.01563C5.56758 3.22284 5.06303 3.51329 4.62093 3.8763L3.00505 3.31901L1.44775 6.01432L2.74202 7.13932C2.69227 7.44481 2.6665 7.7279 2.6665 8C2.6665 8.27251 2.69304 8.55508 2.74202 8.86068V8.86198L1.44775 9.98698L3.00505 12.681L4.61963 12.125C5.06177 12.4882 5.56746 12.777 6.11702 12.9844L6.44385 14.6667H9.55583L9.88265 12.9844C10.4325 12.777 10.9364 12.487 11.3787 12.1237L12.9946 12.681L14.5506 9.98698L13.2576 8.86068C13.3074 8.55519 13.3332 8.2721 13.3332 8C13.3332 7.72831 13.3073 7.44558 13.2576 7.14063V7.13932L14.5519 6.01302L12.9946 3.31901L11.38 3.875C10.9379 3.51179 10.4322 3.22296 9.88265 3.01563L9.55583 1.33333H6.44385ZM7.54281 2.66667H8.45687L8.71598 4L9.4113 4.26302C9.83041 4.42098 10.207 4.63784 10.5337 4.90625L11.1092 5.3776L12.3905 4.9375L12.8475 5.72787L11.8241 6.61849L11.9412 7.35156V7.35287C11.982 7.60282 11.9998 7.81251 11.9998 8C11.9998 8.18749 11.982 8.39715 11.9412 8.64714L11.8228 9.38021L12.8462 10.2708L12.3892 11.0625L11.1092 10.6211L10.5324 11.0938C10.2056 11.3622 9.83041 11.579 9.4113 11.737H9.40999L8.71468 12L8.45557 13.3333H7.54281L7.28369 12L6.58838 11.737C6.16927 11.579 5.79272 11.3622 5.46598 11.0938L4.89046 10.6224L3.60921 11.0625L3.15218 10.2721L4.17692 9.38021L4.05843 8.64974V8.64844C4.01825 8.39739 3.99984 8.18712 3.99984 8C3.99984 7.81251 4.01767 7.60286 4.05843 7.35287L4.17692 6.61979L3.15218 5.72917L3.60921 4.9375L4.89046 5.37891L5.46598 4.90625C5.79272 4.63784 6.16927 4.42098 6.58838 4.26302L7.28369 4L7.54281 2.66667ZM7.99984 5.33333C6.53549 5.33333 5.33317 6.53565 5.33317 8C5.33317 9.46435 6.53549 10.6667 7.99984 10.6667C9.46419 10.6667 10.6665 9.46435 10.6665 8C10.6665 6.53565 9.46419 5.33333 7.99984 5.33333ZM7.99984 6.66667C8.74082 6.66667 9.33317 7.25902 9.33317 8C9.33317 8.74099 8.74082 9.33333 7.99984 9.33333C7.25885 9.33333 6.6665 8.74099 6.6665 8C6.6665 7.25902 7.25885 6.66667 7.99984 6.66667Z" />
    </svg>
  );
};

export const Icon_key: React.FC<IconProjectsProps> = ({
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
      fill="none"
      onClick={handleClick}
      className={className}
    >
      <mask
        id="mask0_2349_7207"
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="16"
        height="16"
      >
        <rect width="16" height="16" fill="#D9D9D9" />
      </mask>
      <g mask="url(#mask0_2349_7207)">
        <path
          d="M4.66675 9.33333C4.30008 9.33333 3.98619 9.20278 3.72508 8.94167C3.46397 8.68056 3.33341 8.36667 3.33341 8C3.33341 7.63333 3.46397 7.31944 3.72508 7.05833C3.98619 6.79722 4.30008 6.66667 4.66675 6.66667C5.03341 6.66667 5.3473 6.79722 5.60841 7.05833C5.86953 7.31944 6.00008 7.63333 6.00008 8C6.00008 8.36667 5.86953 8.68056 5.60841 8.94167C5.3473 9.20278 5.03341 9.33333 4.66675 9.33333ZM4.66675 12C3.55564 12 2.61119 11.6111 1.83341 10.8333C1.05564 10.0556 0.666748 9.11111 0.666748 8C0.666748 6.88889 1.05564 5.94444 1.83341 5.16667C2.61119 4.38889 3.55564 4 4.66675 4C5.41119 4 6.08619 4.18333 6.69175 4.55C7.2973 4.91667 7.77786 5.4 8.13341 6H14.0001L16.0001 8L13.0001 11L11.6667 10L10.3334 11L8.91675 10H8.13341C7.77786 10.6 7.2973 11.0833 6.69175 11.45C6.08619 11.8167 5.41119 12 4.66675 12ZM4.66675 10.6667C5.28897 10.6667 5.83619 10.4778 6.30841 10.1C6.78064 9.72222 7.09453 9.24444 7.25008 8.66667H9.33341L10.3001 9.35L11.6667 8.33333L12.8501 9.25L14.1001 8L13.4334 7.33333H7.25008C7.09453 6.75556 6.78064 6.27778 6.30841 5.9C5.83619 5.52222 5.28897 5.33333 4.66675 5.33333C3.93341 5.33333 3.30564 5.59444 2.78341 6.11667C2.26119 6.63889 2.00008 7.26667 2.00008 8C2.00008 8.73333 2.26119 9.36111 2.78341 9.88333C3.30564 10.4056 3.93341 10.6667 4.66675 10.6667Z"
          fill="#171717"
        />
      </g>
    </svg>
  );
};

export const Icon_east: React.FC<IconProjectsProps> = ({
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
      onClick={handleClick}
      className={className}
      fill="currentColor"
    >
      <mask
        id="mask0_575_3318"
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="16"
        height="16"
      >
        <rect width="16" height="16" fill="#D9D9D9" />
      </mask>
      <g mask="url(#mask0_575_3318)">
        <path d="M9.99967 12.6666L9.04967 11.7333L12.1163 8.66659H1.33301V7.33325H12.1163L9.06634 4.26659L9.99967 3.33325L14.6663 7.99992L9.99967 12.6666Z" />
      </g>
    </svg>
  );
};
export const Icon_add: React.FC<IconProjectsProps> = ({
  onClick,
  className,
}) => {
  const handleClick = (e: React.MouseEvent<SVGElement>) => {
    //e.stopPropagation();
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
        id="mask0_2349_4833"
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="16"
        height="16"
      >
        <rect width="16" height="16" />
      </mask>
      <g mask="url(#mask0_2349_4833)">
        <path d="M7.33325 8.66659H3.33325V7.33325H7.33325V3.33325H8.66659V7.33325H12.6666V8.66659H8.66659V12.6666H7.33325V8.66659Z" />
      </g>
    </svg>
  );
};
export const Icon_close: React.FC<IconProjectsProps> = ({
  onClick,
  className,
}) => {
  const handleClick = (e: React.MouseEvent<SVGElement>) => {
    //e.stopPropagation();
    if (onClick) {
      onClick(e);
    }
  };
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      onClick={handleClick}
      className={className}
    >
      <path d="M13.46 12L19 17.54V19H17.54L12 13.46L6.46 19H5V17.54L10.54 12L5 6.46V5H6.46L12 10.54L17.54 5H19V6.46L13.46 12Z" />
    </svg>
  );
};
