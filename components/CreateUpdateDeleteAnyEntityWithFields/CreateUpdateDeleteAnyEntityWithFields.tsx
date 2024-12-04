import React, { useEffect, useState } from "react";
import "./CreateUpdateDeleteAnyEntityWithFields.css";
import Appmodal from "../appmodal/Appmodal";
import {
  createAnyEntity,
  deleteAnyEntity,
  updateAnyEntity,
} from "../../utils/createUpdateDeleteAnyEntity";

import { useNavigate } from "react-router-dom";
import EntityForm from "./FormComponent";
import { IEditField } from "../../types/fields";

interface IItem {
  id?: string;
  name: string;
  createdAt: string;
  [key: string]: any;
}

interface IProps {
  currentItem: IItem;
  initAllFields: IEditField[];
  itemsService: any;
  messages: any;
  pageTitle?: string;
  buttonTitle?: string;
  parentUrl: string | ((v: boolean) => void);
  serviceOptions?: {
    headers?: any;
    params?: any;
    hiddenFields?: any[];
  };
}

const CreateUpdateDeleteAnyEntityWithFields = ({
  currentItem,
  messages = {},
  itemsService,
  initAllFields,
  pageTitle = "Create item",
  buttonTitle = "Create",
  parentUrl,
  serviceOptions,
}: IProps) => {
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const handleSubmit = async (data: any) => {
    const dataToSend = {
      ...data,
      // Распределяем все скрытые поля, если они есть
      ...serviceOptions?.hiddenFields?.reduce(
        (acc, field) => ({
          ...acc,
          [field.name]: field.value,
        }),
        {}
      ),
    };

    if (!currentItem.id) {
      await createAnyEntity(
        dataToSend,
        itemsService,
        messages.afterCreate,
        serviceOptions
      );
    } else {
      await updateAnyEntity(
        currentItem.id,
        dataToSend,
        itemsService,
        messages.afterEdit,
        serviceOptions
      );
    }
    if (typeof parentUrl === "function") {
      parentUrl(false);
    } else {
      navigate(parentUrl);
    }
  };
  const handleDelete = async () => {
    if (currentItem?.id) {
      await deleteAnyEntity(currentItem.id, itemsService, messages.afterDelete);
      if (typeof parentUrl === "function") {
        parentUrl(false);
      } else {
        navigate(parentUrl);
      }
    }
  };

  return (
    <>
      <EntityForm
        fields={initAllFields}
        currentItem={currentItem}
        onSubmit={handleSubmit}
        onDelete={() => setShowDeleteModal(true)}
        onCancel={() => {
          if (typeof parentUrl === "function") {
            parentUrl(false);
          } else {
            navigate(parentUrl);
          }
        }}
        pageTitle={pageTitle}
        buttonTitle={buttonTitle}
        showDeleteButton={Boolean(currentItem?.id)}
      />
      {showDeleteModal && (
        <Appmodal
          openModal={showDeleteModal}
          handleCloseModal={() => setShowDeleteModal(false)}
          setOpenModal={setShowDeleteModal}
          modalTitle={messages.forDeleteModal?.modalTitle}
          handleAction={handleDelete}
          modalText={
            messages.forDeleteModal?.modalText?.replace(
              "${item.name}",
              currentItem?.name ||
                currentItem?.title ||
                currentItem?.email ||
                "item"
            ) || "Are you sure you want to do this?"
          }
          buttonTitle={messages.forDeleteModal?.buttonTitle}
        />
      )}
    </>
  );
};

export default CreateUpdateDeleteAnyEntityWithFields;
