import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

import styles from "./CreateItemForEntity.module.css";
import "./CreateItemForEntity.css";

import { FormProvider, useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { createAnyEntity, createSchema, getItemForEdit } from "../../utils";

import { GlobalStateContext } from "../../context/GlobalStateProvider";

import {
  IDataForEditPage,
  IEditField,
  IOptionsForActionDelete,
} from "../../types/appdata";
import Appmodal from "../appmodal/Appmodal";
import {
  deleteAnyEntity,
  getAnyEntity,
  updateAnyEntity,
} from "../../utils/createUpdateDeleteAnyEntity";
import { removeNoneOptions } from "../../utils/removeNoneOptions";
import GetInputForField from "../GetInputForField/GetInputForField";

interface IItem {
  id?: string;
  name: string;
  createdAt: string;
  [key: string]: any;
}

interface IProps {
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
        if (currentItem.id) {
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
    defaultValues: currentItem,
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
    if (!currentItem.id) {
      await createAnyEntity({ ...data }, itemsService, afterCreateMessage).then(
        () => {}
      );
    } else {
      await updateAnyEntity(
        currentItem.id,
        data,
        itemsService,
        afterUpdateMessage
      ).then(() => {});
    }
  };
  const deleteItem = async () => {
    if (currentItem && currentItem.id) {
      await deleteAnyEntity(currentItem.id, itemsService, afterDeleteMessage)
        .then(() => {})
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
  };

  useEffect(() => {
    if (currentItem.id) {
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

  //console.log(initAllFields);

  return (
    <>
      <div className={styles.container}>
        <div className={`${styles.header} modalHeader`}>
          <span
            className="body-l-medium"
            style={{
              flex: "1 0 0",
            }}
          >
            {!currentItem.id
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
            noValidate
            autoComplete="new-password"
            className={styles.form}
          >
            {initAllFields.map((field: IEditField) => {
              return (
                <div
                  className={`input_container_for_from ${
                    field.foreignKey && field.foreignKeyValue !== watchedValue
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
          </form>
        </FormProvider>
      </div>

      {openConfirmModal && (
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
