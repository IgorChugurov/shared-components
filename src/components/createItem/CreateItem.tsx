import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

import { Modal } from "@mui/material";
import styles from "./CreateItem.module.css";

import { FormProvider, useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { createAnyEntity, createSchema } from "../../utils";

import { GlobalStateContext } from "../../context/GlobalStateProvider";
import { Icon_info, Icon_window_close } from "./Icons";
import {
  IDataForEditPage,
  IEditField,
  IOptionsForActionDelete,
} from "../../types/appdata";
import Appmodal from "../appmodal/Appmodal";
import {
  deleteAnyEntity,
  updateAnyEntity,
} from "../../utils/createUpdateDeleteAnyEntity";
import { removeNoneOptions } from "../../utils/removeNoneOptions";
import GetInputForField from "./GetInputForField";

interface IItem {
  id?: string;
  name: string;
  createdAt: string;
  [key: string]: any;
}

interface IProps {
  openModal: boolean;
  handleCloseModal: () => void;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
  currentItem: IItem;
  dataForEditPage: IDataForEditPage;

  initAllFields: IEditField[];
  itemsService: any;
  messages: any;
  parentEntityId?: string; // to exclude the parent entity from the list of entities for select
}
//allFields we use to create the resolverSchema
const CreateItem = ({
  currentItem,
  openModal,
  handleCloseModal,
  setOpenModal,
  dataForEditPage,
  messages = {},
  itemsService,
  initAllFields,
  parentEntityId,
}: IProps) => {
  const {
    afterCreate: afterCreateMessage,
    afterEdit: afterUpdateMessage,
    afterDelete: afterDeleteMessage,
    forDeleteModal,
  } = messages;

  const {
    modalText: modalTextDeleteVariant,
    modalTitle: modalTitleDelete,
    confirmText: confirmTextDelete,
    confirmWord: confirmWordDelete,
    buttonTitle: buttonTitleDelete,
  } = forDeleteModal || {};

  const modalTextDelete =
    modalTextDeleteVariant?.replace(
      "${item.name}",
      currentItem?.name || "item"
    ) || " Are you sure you want to do this?";

  const [buttonTitle, setButtonTitle] = useState("Create");
  const { sections: initSection, buttonText } = dataForEditPage;
  const [sections] = useState<any[]>(
    initSection?.filter((sec) => {
      sec.fields = sec.fields.filter((field) => {
        if (currentItem && currentItem.id) {
          return field.forEditPage;
        } else {
          return field.forCreatePage;
        }
      });
      return Boolean(
        sec.fields.length || (sec.button && currentItem && currentItem.id)
      );
    }) || []
  );

  const { darkMode, entitiesList, renewData } = useContext(GlobalStateContext);
  const [openConfirmModal, setOpenConfirmModal] = useState<boolean>(false);

  const [action, setAction] = useState<any>(null);
  const [modalTitle, setModalTitle] = useState("");
  const [modalText, setModalText] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [confirmWord, setConfirmWord] = useState("");

  const [allFields] = useState<IEditField[]>(initAllFields);

  const handleActionItem = (section: {
    action: string;
    title: string;
    label?: string;
    options?: IOptionsForActionDelete;
  }) => {
    setAction(section);
    setModalTitle(modalTitleDelete || "Confirm action");
    setModalText(modalTextDelete);
    setConfirmText(confirmTextDelete || "");
    setConfirmWord(confirmWordDelete || "");
    setButtonTitle(buttonTitleDelete || "Confirm");
    setOpenConfirmModal(true);
  };

  const [loading, setLoading] = useState(false);
  const resolverSchema = Yup.object().shape(createSchema(allFields));
  const methods = useForm({
    mode: "onTouched",
    resolver: yupResolver(resolverSchema),
    defaultValues: currentItem || {},
  });
  const { control, watch } = methods;
  // this is for the case when we have a foreign key field and we wath for the value of the foreign key input . if the value changes we show or hide the field if the value
  // of the foreign key is the same as the value of the parentEntityId. this is for the case when we have a field that is a foreign key and we want to exclude the parent entity from the list of entities for select
  const foreignKeyFields = allFields.find((field: any) => field.foreignKey);
  const { foreignKey } = foreignKeyFields || {};

  let watchedValue: any;
  if (typeof foreignKey === "string") {
    watchedValue = watch(foreignKey as any);
  }

  const onSubmitUpload = methods.handleSubmit(async (data) => {
    setLoading(true);
    createOrUpdateData(data);
  });

  const createOrUpdateData = async (data: any) => {
    removeNoneOptions(data, allFields);
    if (!currentItem || !currentItem.id) {
      await createAnyEntity({ ...data }, itemsService, afterCreateMessage).then(
        () => {
          setOpenModal(false);
        }
      );
    } else {
      await updateAnyEntity(
        currentItem.id,
        data,
        itemsService,
        afterUpdateMessage
      ).then(() => {
        setOpenModal(false);
      });
    }
  };
  const deleteItem = async () => {
    if (currentItem && currentItem.id) {
      await deleteAnyEntity(currentItem.id, itemsService, afterDeleteMessage)
        .then(() => {
          setOpenModal(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  const handleAction = async () => {
    if (action && action.action === "delete") {
      await deleteItem();
    }
    setAction(null);
    setOpenConfirmModal(false);
    setOpenModal(false);
  };

  useEffect(() => {
    if (currentItem && currentItem.id) {
      setButtonTitle(buttonText?.update || "Update");
      // getAnyEntity(currentItem.id, itemsService).then((res: any) => {
      //   const itemFromServer = getItemForEdit(allFields, res);
      //   methods.reset(itemFromServer);
      // });

      //methods.reset(currentItem);
    } else {
      setButtonTitle(buttonText?.create || "Create");
    }
  }, [currentItem]);

  useEffect(() => {
    // get lists for select fields
    allFields.forEach((field) => {
      if (
        field.type === "select" &&
        field.collectionName &&
        entitiesList[field.collectionName]
      ) {
        renewData(field.collectionName);
      }
    });
  }, [initAllFields]);

  return (
    <>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        BackdropProps={
          darkMode === "dark"
            ? { style: { backgroundColor: "rgb(255, 255, 255,0.15)" } }
            : {}
        }
      >
        <div className={styles.container}>
          <div className={`${styles.header} modalHeader`}>
            <button
              data-size="small"
              className="iconButton secondatyIconButton"
              onClick={() => {
                setOpenModal(false);
              }}
            >
              <Icon_window_close />
            </button>

            <span
              className="body-l-medium"
              style={{
                flex: "1 0 0",
              }}
            >
              {!currentItem || !currentItem.id
                ? dataForEditPage?.title[0]
                : dataForEditPage?.title[1]}
            </span>

            <button
              className="button primaryButton"
              onClick={onSubmitUpload}
              data-size="small"
            >
              <span className="body-m-medium">{buttonTitle}</span>
            </button>
          </div>

          <FormProvider {...methods}>
            <form
              onSubmit={(e) => e.preventDefault()}
              //onSubmit={methods.handleSubmit(onSubmit, onError)}
              noValidate
              autoComplete="new-password"
              className={styles.form}
            >
              {sections.map((section, i) => (
                <div
                  className={`${styles.section} ${
                    i !== 0 ? styles.borderTop : ""
                  }`}
                  key={section.title}
                >
                  <div className={styles.boxtitle}>
                    <div className={styles.number_box}></div>
                    <span className="mono-s-medium">{section.title}</span>
                  </div>
                  {section.info && (
                    <div className={styles.info_section_container}>
                      <div className={styles.titleInfoContainerWrapper}>
                        <div className={styles.info_containerIconWrapper}>
                          <Icon_info />
                        </div>
                        <span className="body-m-medium">
                          {section.info.title}
                        </span>
                      </div>
                      <div className={styles.info_textWrapper}>
                        <span className="body-s-multiline">
                          {section.info.text}
                        </span>
                      </div>
                    </div>
                  )}
                  {section.button && (
                    <>
                      {section.button.action === "delete" &&
                        currentItem &&
                        currentItem.id && (
                          <div className="dengerButtonWrapper">
                            {section.button.label && (
                              <span className="body-m-multiline text-default">
                                {" "}
                                {section.button.label}
                              </span>
                            )}
                            <button
                              data-outlined="true"
                              className="button dangerButton"
                              onClick={(e: React.MouseEvent<HTMLElement>) => {
                                if (section.button) {
                                  handleActionItem(section.button);
                                }
                              }}
                            >
                              <span className="body-l-medium">
                                {section.button.title}
                              </span>
                            </button>
                          </div>
                        )}
                    </>
                  )}

                  {section.fields.map((field: IEditField) => {
                    return (
                      <div
                        className={`${styles.box_container} ${
                          field.foreignKey &&
                          field.foreignKeyValue !== watchedValue
                            ? "hidden"
                            : ""
                        }`}
                        key={field.name}
                      >
                        <GetInputForField
                          currentItem={currentItem}
                          field={field}
                          parentEntityId={parentEntityId}
                          control={control}
                        />
                      </div>
                    );
                  })}
                </div>
              ))}
            </form>
          </FormProvider>
        </div>
      </Modal>

      {openModal && (
        <Appmodal
          openModal={openConfirmModal}
          handleCloseModal={() => setOpenConfirmModal(false)}
          setOpenModal={setOpenConfirmModal}
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

export default CreateItem;
