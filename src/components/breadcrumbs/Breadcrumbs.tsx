import React, { useContext, useEffect, useState } from "react";
import "./Breadcrumbs.css";
import { Link, useLocation } from "react-router-dom";
import {
  Icon_account_balance,
  Icon_adjust,
  Icon_language,
  Icon_nav,
} from "./Icons";
import { GlobalStateContext } from "../../context/GlobalStateProvider";

const Breadcrumbs = () => {
  const location = useLocation();
  const { currentProject, entitiesList, routeData } =
    useContext(GlobalStateContext);
  const [items, setItems] = useState<{ title: string; link?: string }[]>([]);
  const [project, setProject] = useState<any>({});
  const [isOverflowing, setIsOverflowing] = useState<boolean[]>([]);

  useEffect(() => {
    const data: { title: string; link?: string }[] = [
      { title: project?.name || "application", link: "/" },
    ];
    const arr = location.pathname.split("/");
    //console.log(arr);
    if (location.pathname === "/facilities") {
      data.push({ title: "Facilities", link: "/" });
    } else if (arr[1] === "facilities") {
      const facility = routeData?.facility;
      const title = facility?.name || facility?.title || "";
      data.push({ title: "Facilities", link: "/" }, { title: title });

      if (arr.length >= 5) {
        const entity = routeData?.entity;
        const titleEntity = entity?.name || "";

        data.push({ title: titleEntity });
      }
    }
    setItems(data);
  }, [location.pathname, routeData, project]);

  useEffect(() => {
    const p =
      (entitiesList["projects"] &&
        entitiesList["projects"].list.find(
          (p: any) => p.id === currentProject
        )) ||
      {};
    setProject(p);
  }, [currentProject, entitiesList["projects"]?.list]);

  useEffect(() => {
    const checkOverflow = () => {
      const results = items.map((_, index) => {
        const element = document.getElementById(`breadcrumb-item-${index}`);
        if (element) {
          return element.scrollWidth > element.clientWidth;
        }
        return false;
      });
      setIsOverflowing(results);
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => {
      window.removeEventListener("resize", checkOverflow);
    };
  }, [items]);

  const renderBreadcrumbItem = (
    item: { title: string; link?: string },
    index: number
  ) => {
    const isLastItem = index === items.length - 1;

    if (!item.title) {
      return null;
    }

    return (
      <div
        className={`breadcrumbsWrapper ${isLastItem ? "active" : ""}`}
        key={index}
      >
        {getIcon(index)}
        <span
          id={`breadcrumb-item-${index}`}
          className={`body-s-medium textWithEllipsis`}
        >
          {item.title}
        </span>
        {isOverflowing[index] && (
          <div className="tooltip">
            <span className="body-s-medium textWithEllipsis">{item.title}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`breadcrumbsContainer`}>
      {items.map((item, i) => (
        <React.Fragment key={i}>
          {item.link && i !== items.length - 1 ? (
            <Link to={item.link} className="breadcrumbLink">
              {renderBreadcrumbItem(item, i)}
            </Link>
          ) : (
            renderBreadcrumbItem(item, i)
          )}
          {i !== items.length - 1 && (
            <span className={`divider body-l-regular`}>/</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Breadcrumbs;

const getIcon = (index: number) => {
  const icons = [
    <Icon_language key={index} />,
    <Icon_nav key={index} />,
    <Icon_adjust key={index} />,
    <Icon_account_balance key={index} />,
  ];

  return index < icons.length ? icons[index] : null;
};
