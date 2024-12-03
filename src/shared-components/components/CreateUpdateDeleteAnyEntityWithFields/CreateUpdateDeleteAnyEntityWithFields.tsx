import React, { useState } from "react";
import "./CreateUpdateDeleteAnyEntityWithFields.css";
import Appmodal from "../appmodal/Appmodal";
import {
  createAnyEntity,
  deleteAnyEntity,
  updateAnyEntity,
} from "../../utils/createUpdateDeleteAnyEntity";
import { IEditField } from "../../types/appdata";
import { useNavigate } from "react-router-dom";
import EntityForm from "./FormComponent";

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
  parentUrl: string;
}

const CreateUpdateDeleteAnyEntityWithFields = ({
  currentItem,
  messages = {},
  itemsService,
  initAllFields,
  pageTitle = "Create item",
  buttonTitle = "Create",
  parentUrl,
}: IProps) => {
  //console.log(itemsService);
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const handleSubmit = async (data: any) => {
    if (!currentItem.id) {
      await createAnyEntity(data, itemsService, messages.afterCreate);
    } else {
      await updateAnyEntity(
        currentItem.id,
        data,
        itemsService,
        messages.afterEdit
      );
    }
    navigate(parentUrl);
  };
  const handleDelete = async () => {
    if (currentItem?.id) {
      await deleteAnyEntity(currentItem.id, itemsService, messages.afterDelete);
      navigate(parentUrl);
    }
  };
  return (
    <>
      <EntityForm
        fields={initAllFields}
        currentItem={currentItem}
        onSubmit={handleSubmit}
        onDelete={() => setShowDeleteModal(true)}
        onCancel={() => navigate(parentUrl)}
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
