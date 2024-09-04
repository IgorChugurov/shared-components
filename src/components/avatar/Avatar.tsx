import React from "react";
import "./Avatar.css";
const Avatar = ({
  title,
  onClick,
}: {
  title: string;
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
}) => {
  return (
    <div className="avatarWrapper" onClick={onClick}>
      <span className="avatar body-l-medium">{title}</span>
    </div>
  );
};

export default Avatar;
