import React from "react";

import { Link, useLocation } from "react-router-dom";

const NavItem = ({
  title,
  link,
  startRoute,
}: {
  title: string;
  link: string;
  startRoute?: string;
}) => {
  const location = useLocation();
  const getActiveClass = () => {
    const arr = location.pathname.split("/");
    return location.pathname === link || (arr[1] && arr[1] === startRoute);
  };
  return (
    <Link to={link}>
      <div
        className={`navigationItemcontainer ${
          getActiveClass() ? "active" : ""
        }`}
      >
        <span className={`body-m-medium`}>{title}</span>
      </div>
    </Link>
  );
};

export default NavItem;
