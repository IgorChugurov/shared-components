import { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { Icon_loader } from "./Icons";
export const ParangaForViewport = () => {
  const [dispalyElement, setDispalyElement] = useState(false);
  const parangaSetDisplay = () => {
    setDispalyElement(true);
  };
  const parangaSetHide = () => {
    setDispalyElement(false);
  };
  useEffect(() => {
    window.addEventListener("hideParange", parangaSetHide);
    window.addEventListener("showParange", parangaSetDisplay);

    return () => {
      window.removeEventListener("hideParange", parangaSetHide);
      window.removeEventListener("showParange", parangaSetDisplay);
    };
  }, []);
  //console.log(dispalyElement);
  return (
    <>
      {dispalyElement && (
        <div className={styles.container}>
          <Icon_loader className="rotate" />
        </div>
      )}
    </>
  );
};

export default ParangaForViewport;
