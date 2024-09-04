import React, { useRef, useEffect, useState } from "react";

type CollapseProps = {
  in: boolean;
  onClick?: () => void;
  children: React.ReactNode;
};

const Collapse = ({ in: show, children, onClick }: CollapseProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  // Update the height based on the content
  useEffect(() => {
    setHeight(show ? contentRef.current?.scrollHeight ?? 0 : 0);
  }, [show]);

  return (
    <div
      style={{
        overflow: "hidden",
        transition: "height 300ms ease",
        height: `${height}px`,
      }}
      onClick={onClick}
    >
      <div ref={contentRef}>{children}</div>
    </div>
  );
};

export default Collapse;
