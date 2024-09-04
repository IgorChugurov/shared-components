import { Modal } from "@mui/material";

import { useContext, useState } from "react";
import styles from "./Appmodal.module.css";

import { GlobalStateContext } from "../../context/GlobalStateProvider";
import { Icon_window_close } from "./Icons";
interface IProps {
  openModal: boolean;
  handleCloseModal: () => void;
  modalTitle: string;
  setOpenModal: (val: boolean) => void;
  handleAction: () => void;
  confirmWord?: string;
  confirmSuggestion?: string;
  modalText?: string;
  buttonTitle?: string;
}
const Appmodal = ({
  openModal,
  handleCloseModal,
  modalTitle,
  setOpenModal,
  handleAction,
  confirmWord,
  confirmSuggestion,
  modalText,
  buttonTitle = "Confirm",
}: IProps) => {
  const { darkMode } = useContext(GlobalStateContext);
  const [confirmText, setConfirmText] = useState("");
  const handleConfirm = () => {
    handleAction();
  };
  //console.log(confirmText, confirmWord);
  return (
    <div>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        BackdropProps={
          darkMode === "dark"
            ? { style: { backgroundColor: "rgb(255, 255, 255,0.15)" } }
            : {}
        }
      >
        <div className={styles.wrapper}>
          <div className={`${styles.header} modalHeader`}>
            <span className={`text-default headings-h3`}>{modalTitle}</span>

            <button
              data-size="small"
              className="iconButton secondatyIconButton"
              onClick={() => {
                setOpenModal(false);
              }}
            >
              <Icon_window_close />
            </button>
          </div>

          <div className={styles.content}>
            <div className={styles.textWrapper}>
              <span className="body-m-multiline text-default">{modalText}</span>
            </div>
            {confirmWord && (
              <>
                <div className={styles.textWrapper}>
                  <span className="body-m-medium">{confirmSuggestion}</span>
                </div>
                <input
                  placeholder="Type confirmation word"
                  className="custom-input"
                  type="text"
                  onChange={(e) => {
                    setConfirmText(e.target.value);
                  }}
                ></input>
              </>
            )}
          </div>

          <div className={styles.footer}>
            <div className={styles.buttonWrapper}>
              <button
                className="button secondaryButton"
                onClick={(e: any) => setOpenModal(false)}
              >
                <span className="body-m-regular">Cancel</span>
              </button>
              <button
                className="button dangerButton"
                disabled={Boolean(confirmWord && confirmWord !== confirmText)}
                onClick={(e) => {
                  setOpenModal(false);
                  handleConfirm();
                }}
              >
                <span className="body-m-regular">{buttonTitle}</span>
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Appmodal;
