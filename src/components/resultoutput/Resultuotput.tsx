import { useEffect, useState } from "react";
import styles from "./resultuotput.module.css";
import { Icon_check_circle, Icon_close } from "./Icons";
import Collapse from "../collapse/Collapse";

export const Resultoutput = ({}: {}) => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const handleSetError = (event: CustomEvent) => {
    const data: string = event.detail || "";
    setError(data);
  };
  const handleSetSuccess = (event: CustomEvent) => {
    const data: string = event.detail || "";
    setSuccess(data);
  };

  useEffect(() => {
    window.addEventListener("setError", handleSetError as EventListener);
    window.addEventListener("setSuccess", handleSetSuccess as EventListener);
    return () => {
      window.removeEventListener("setError", handleSetError as EventListener);
      window.removeEventListener(
        "setSuccess",
        handleSetSuccess as EventListener
      );
    };
  }, []);

  return (
    <>
      <div className={styles.container}>
        <Collapse
          in={Boolean(error && error !== "")}
          onClick={() => {
            setError("");
          }}
        >
          <div className={styles.innerContainerError}>
            <div className={styles.titleWrap}>
              <Icon_check_circle className={styles.iconError} />
              <span className="body-m-medium  text-default textWithEllipsis">
                {error}
              </span>
            </div>
            <Icon_close className={styles.iconClose} />
          </div>
        </Collapse>
        <Collapse
          in={Boolean(success && success !== "")}
          onClick={() => {
            setSuccess("");
          }}
        >
          <div className={styles.innerContainerSuccess}>
            <div className={styles.titleWrap}>
              <Icon_check_circle className={styles.iconSuccess} />
              <span className="body-m-medium  textWithEllipsis">{success}</span>
            </div>
            <Icon_close className={styles.iconClose} />
          </div>
        </Collapse>
      </div>
    </>
  );
};

export default Resultoutput;
