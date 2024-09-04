import React, { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (location.pathname === "/") {
      navigate("/facilities");
    }
  }, [location.pathname]);
  return <Outlet />;
};

export default Home;
