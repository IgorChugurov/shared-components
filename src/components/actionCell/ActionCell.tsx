import { Dispatch, SetStateAction, useState } from "react";

import styles from "./ActionCell.module.css";
import React from "react";
import Appmodal from "../appmodal/Appmodal";
import { ApiService } from "../../services/servicesPackage";
import {
  Icon_delete_inlist,
  Icon_pencil_outline,
  Icon_setting_inlist,
} from "./Icons";
import { Link } from "react-router-dom";
import { IActionData } from "../../types/appdata";
import { deleteAnyEntity } from "../../utils/createUpdateDeleteAnyEntity";

const ActionCell: React.FC<{
  actions: IActionData[];
  rowId?: number | string;
  item: any;
  setCurrentItem?: (d: any) => void;
  setEditModalOpen?: Dispatch<SetStateAction<boolean>>;
  dataService: ApiService<any>;
  deleteMessage?: string;
}> = ({
  rowId,
  item,
  setCurrentItem,
  setEditModalOpen,
  dataService,
  actions = [],
  deleteMessage = "",
}) => {
  const url = window.location.pathname;
  const [action, setAction] = useState<IActionData | null>(null);
  const [modalTitle, setModalTitle] = useState("");
  const [modalText, setModalText] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [confirmWord, setConfirmWord] = useState("");
  const [buttonTitle, setButtonTitle] = useState("Confirm");

  const handleActionItem = (action: IActionData) => {
    setAction(action);
    const { confirmText, confirmWord, modalTitle, modalText, buttonTitle } =
      action.options || {};

    setConfirmText(confirmText || "");
    setConfirmWord(confirmWord || "");
    setModalTitle(modalTitle || `Confirm`);
    setButtonTitle(buttonTitle || "Confirm");
    setModalText(
      modalText
        ? modalText.replace(
            "${item.name}",
            item.name || item.title || item.email
          )
        : "Are you sure you want to do this?"
    );
    setOpenModal(true);
  };

  const handleAction = async () => {
    if (action && action.action === "delete") {
      await deleteItem();
    }
    setAction(null);
  };
  const deleteItem = async () => {
    deleteAnyEntity(item.id, dataService, deleteMessage);
  };

  return (
    <>
      <div className={styles.iconContainer}>
        {actions.map((action, i) => (
          <React.Fragment key={i}>
            {action.action === "edit" && (
              <>
                {action.link ? (
                  <Link
                    to={`${url}/${rowId}${
                      action.additioonalUrl ? action.additioonalUrl : ""
                    }`}
                  >
                    <button
                      data-size="small"
                      className="iconButton tertiaryIconButton"
                    >
                      {action.icon && action.icon === "setting" ? (
                        <Icon_setting_inlist />
                      ) : (
                        <Icon_pencil_outline />
                      )}
                    </button>
                  </Link>
                ) : setCurrentItem && setEditModalOpen ? (
                  <button
                    data-size="small"
                    className="iconButton tertiaryIconButton"
                    onClick={(e: React.MouseEvent<HTMLElement>) => {
                      if (item) {
                        setCurrentItem(item);
                        setEditModalOpen(true);
                      }
                    }}
                  >
                    <Icon_pencil_outline />
                  </button>
                ) : (
                  <></>
                )}
              </>
            )}

            {action.action === "delete" && (
              <button
                data-size="small"
                className="iconButton tertiaryIconButton"
                onClick={(e: React.MouseEvent<HTMLElement>) => {
                  handleActionItem(action);
                }}
              >
                <Icon_delete_inlist />
              </button>
            )}
          </React.Fragment>
        ))}
      </div>

      {openModal && (
        <Appmodal
          openModal={openModal}
          handleCloseModal={() => setOpenModal(false)}
          setOpenModal={setOpenModal}
          modalTitle={modalTitle}
          confirmWord={confirmWord}
          confirmSuggestion={confirmText}
          handleAction={handleAction}
          modalText={modalText}
          buttonTitle={buttonTitle}
        />
      )}
    </>
  );
};
export default ActionCell;
