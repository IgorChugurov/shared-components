import { Dispatch, SetStateAction, useState } from "react";
import "./ActionCell.css";
import styles from "./ActionCell.module.css";
import React from "react";

import {
  Icon_delete_inlist,
  Icon_pencil_outline,
  Icon_setting_inlist,
} from "./Icons";
import { Link } from "react-router-dom";

import Appmodal from "../../../appmodal/Appmodal";
import { ApiService } from "../../../../services/apiService";
import { IActionData } from "../../../../types/grid";
import { deleteAnyEntity } from "../../../../utils/createUpdateDeleteAnyEntity";

const ActionCell: React.FC<{
  actions: IActionData[];
  rowId?: number | string;
  item: any;
  setCurrentItem?: (d: any) => void;
  setEditModalOpen?: Dispatch<SetStateAction<boolean>>;
  dataService: ApiService<any>;
  deleteMessage?: string;
  setDeleteActionIds?: Dispatch<SetStateAction<any>>;
  listUrl: string;
}> = ({
  rowId,
  item,
  setCurrentItem,
  setEditModalOpen,
  dataService,
  actions = [],
  deleteMessage = "",
  setDeleteActionIds,
  listUrl,
}) => {
  //const url = window.location.pathname;

  const [action, setAction] = useState<IActionData | null>(null);
  const [modalTitle, setModalTitle] = useState("");
  const [modalText, setModalText] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [confirmWord, setConfirmWord] = useState("");
  const [buttonTitle, setButtonTitle] = useState("Confirm");
  const [loading, setLoading] = useState(false);

  const handleActionItem = (action: IActionData) => {
    setAction(action);
  };

  const handleAction = async () => {
    setLoading(true);
    if (action && action.action === "delete") {
      try {
        await deleteAnyEntity(item.id, dataService, deleteMessage);
      } catch (error) {
      } finally {
        if (setDeleteActionIds) {
          setDeleteActionIds((prev: any) => {
            if (rowId) {
              return { ...prev, [rowId]: false };
            }
            return prev;
          });
        }
        setAction(null);
        setLoading(false);
      }
    }
  };

  return (
    <>
      <div className={styles.iconContainer}>
        {action && action.action === "delete" ? (
          <div className="deleteActionInCell">
            <button
              data-size="small"
              className="button secondaryButton"
              onClick={(e: React.MouseEvent<HTMLElement>) => {
                if (setDeleteActionIds) {
                  setDeleteActionIds((prev: any) => {
                    if (rowId) {
                      return { ...prev, [rowId]: false };
                    }
                    return prev;
                  });
                }
                setAction(null);
              }}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              data-size="small"
              className="button dangerButton"
              onClick={(e: React.MouseEvent<HTMLElement>) => {
                handleAction();
              }}
              disabled={loading}
            >
              Delete
            </button>
          </div>
        ) : (
          actions.map((action, i) => (
            <React.Fragment key={i}>
              {action.action === "edit" && (
                <>
                  {action.link ? (
                    <Link
                      to={`${listUrl}/${rowId}${
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
                    if (setDeleteActionIds) {
                      setDeleteActionIds((prev: any) => {
                        if (rowId) {
                          return { ...prev, [rowId]: true };
                        }
                        return prev;
                      });
                    }
                    handleActionItem(action);
                  }}
                >
                  <Icon_delete_inlist />
                </button>
              )}
            </React.Fragment>
          ))
        )}
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
