import React, { useContext } from "react";
import useWindowDimensions from "../../hooks/windowDimensions";
import "./NavbarApp.css"; // Импортируйте новый CSS-файл

import { Menu, MenuItem } from "@mui/material";
import { UserDataContext } from "../../context/userDataContext";
import { Link, useLocation } from "react-router-dom";

import { Icon_arrow_back, Icon_Move_item } from "./Icons";
import { GlobalStateContext } from "../../context/GlobalStateProvider";
import { Icon_Logo } from "../icons/Icons";
import Breadcrumbs from "../breadcrumbs/Breadcrumbs";
import Avatar from "../avatar/Avatar";

const NavbarApp = ({
  LogoIcon,
  darkTheme,
}: {
  LogoIcon?: any;
  darkTheme?: boolean;
}) => {
  const { userData } = useContext(UserDataContext);
  const location = useLocation();

  const { toggleDarkMode, TITLE, VERSION } = useContext(GlobalStateContext);

  const userTitle = (userData?.email || "PP").substring(0, 2);
  const { windowWidth } = useWindowDimensions();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const loguot = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            className: "menuPaper menuInNavbar",
            sx: { width: "240px", paddingBottom: "4px" },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <div className="menuItem menuItemContainer">
          <div className="menuItemWrap">
            <span className="body-m-medium text-default textWithEllipsis">
              {userData?.email}
            </span>
          </div>
        </div>
        <div className="menuItemAsBorder" />

        <MenuItem onClick={() => loguot()} className="menuItem text-default">
          <Icon_Move_item />
          <div className="menuItemWrap">
            <span className="body-m-regular text-default textWithEllipsis">
              Log out
            </span>
          </div>
        </MenuItem>
        <div className="menuItemAsBorder" />

        <div className="menuItem menuItemContainer">
          <div className="menuItemWrap">
            <span className="body-s-regular text-secondary textWithEllipsis">
              Version {VERSION}
            </span>
          </div>
        </div>
      </Menu>

      <div className={`navbarContainer ${darkTheme ? "dark" : ""}`}>
        <div className="left">
          {location.pathname === "/settings" ? (
            <Link to={`/`}>
              <button className="button primaryButton" data-size="small">
                <Icon_arrow_back />
                <span className="back body-m-medium">Back</span>
              </button>
            </Link>
          ) : (
            <>
              <div className="logoWrapper">
                <Link to={`/`}>{LogoIcon ? <LogoIcon /> : <Icon_Logo />}</Link>
              </div>
            </>
          )}
        </div>

        <div className="center">
          <Breadcrumbs />
        </div>
        <div className="right">
          <Avatar title={userTitle} onClick={handleClick} />
        </div>
      </div>
    </>
  );
};

export default NavbarApp;
