import React, { useEffect, useState } from "react";
import styles from "./EditFields.module.css";
import { IEditField, IOptionsListItem } from "../../types/appdata";

import { FormProvider, set, useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { InputText } from "../inputs/InputText";

import { InputSwitch } from "../inputs/InputSwitch";

import { createSchema } from "../../utils";
import {
  createAnyEntity,
  deleteAnyEntity,
  updateAnyEntity,
} from "../../utils/createUpdateDeleteAnyEntity";
import Appmodal from "../appmodal/Appmodal";
import { useLocation, useNavigate } from "react-router-dom";
import { InputSelect } from "../inputs/InputSelect";
import { InputRadio } from "../inputs/InputRadio";
import { InputSwitchWithoutLabel } from "../inputs/InputSwitchWithoutLabel";
import { InputSelectWithoutLabel } from "../inputs/InputSelectWithotLabel";

const EditFields = ({
  fields,
  currentItem,
  itemService,
  title,
  initData,
  transformData,
  emptyText = "No fields to display",
}: {
  fields: (IEditField & { description?: string; disabled?: boolean })[];
  currentItem: any;
  itemService: any;
  title: string;
  initData?: IOptionsListItem;
  transformData?: (data: any) => any;
  emptyText?: string;
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const button = fields.find((field) => field.type === "deleteButton");
  const { forList } = initData || {};
  const { afterDelete: afterDeleteMessage, forDeleteModal } =
    forList?.messages || {};
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
    ) || "Are you sure you want to do this?";

  const resolverSchema = Yup.object().shape(createSchema(fields));

  const methods = useForm({
    mode: "onTouched",
    resolver: yupResolver(resolverSchema),
    defaultValues: currentItem,
  });
  const { control, formState, handleSubmit, watch } = methods;
  const { isDirty } = formState;

  const onSubmitUpload = handleSubmit(async (data) => {
    if (currentItem.id) {
      const item = transformData
        ? transformData(data)
        : { ...data, id: currentItem.id };
      const res = await updateAnyEntity(currentItem.id, item, itemService);
    } else {
      const item = { ...data };
      await createAnyEntity(item, itemService);
    }
    methods.reset(data);
  });

  const [openModal, setOpenModal] = useState(false);
  const [action, setAction] = useState<string>("");
  const [modalTitle, setModalTitle] = useState("");
  const [modalText, setModalText] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [confirmWord, setConfirmWord] = useState("");
  const [buttonTitle, setButtonTitle] = useState("");

  const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setAction("delete");
  };

  useEffect(() => {
    if (action === "delete") {
      setModalTitle(modalTitleDelete || "Confirm action");
      setModalText(modalTextDelete);
      setConfirmText(confirmTextDelete || "");
      setConfirmWord(confirmWordDelete || "");
      setButtonTitle(buttonTitleDelete || "Confirm");
      setOpenModal(true);
    }
  }, [action]);
  useEffect(() => {
    if (!openModal) {
      setAction("");
    }
  }, [openModal]);
  const handleAction = async () => {
    if (action === "delete") {
      await deleteItem();
    }
    setAction("");
  };
  const deleteItem = async () => {
    await deleteAnyEntity(currentItem.id, itemService, afterDeleteMessage)
      .then(() => {
        handleNavigateBack();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleNavigateBack = () => {
    const pathArray = location.pathname.split("/");
    // Remove the last part of the path
    const newPath = pathArray.slice(0, -2).join("/");
    navigate(newPath);
  };

  useEffect(() => {
    methods.reset(currentItem);
  }, [currentItem]);

  return (
    <>
      <div className={styles.header}>
        <span className="headings-h3">{title}</span>
        {!button && (
          <button
            className="button primaryButton"
            data-size="small"
            onClick={onSubmitUpload}
            disabled={!isDirty}
          >
            <span className="body-m-medium">Save</span>
          </button>
        )}
      </div>
      {fields.length === 0 ? (
        <span className="body-m-multiline text-secondary textAlignCenter">
          {emptyText}
        </span>
      ) : (
        <FormProvider {...methods}>
          <form onSubmit={onSubmitUpload} className={styles.form}>
            {fields.map((field, i) => (
              <React.Fragment key={field.name}>
                {renderField({
                  field,
                  control,
                  currentItem,
                  i,
                  handleDeleteClick,
                })}
              </React.Fragment>
            ))}
            {/* {fields.map((field, i) => {
              switch (field.type) {
                case "switch":
                  return (
                    <>
                      {i !== 0 && <div className={styles.borderTop}></div>}
                      <div
                        className={`${styles.fieldWrapper} ${
                          i ? styles.borderTop : ""
                        }`}
                        key={field.name}
                      >
                        <Label
                          label={field.label || ""}
                          description={field.description || ""}
                        />
                        <div className={styles.inputWrapper}>
                          <InputSwitchWithoutLabel
                            key={field.name}
                            name={field.name}
                            control={control}
                          />
                        </div>{" "}
                      </div>
                    </>
                  );
                case "select":
                  return (
                    <>
                      {i !== 0 && <div className={styles.borderTop}></div>}
                      <div
                        className={`${styles.fieldWrapper} ${
                          i ? styles.borderTop : ""
                        }`}
                        key={field.name}
                      >
                        <Label
                          label={field.label || ""}
                          description={field.description || ""}
                        />
                        <div className={styles.inputWrapper}>
                          <InputSelectWithoutLabel
                            {...field}
                            control={control}
                            disabled={Boolean(
                              currentItem.id && field.forEditPageDisabled
                            )}
                            options={field.options || []}
                          />
                        </div>
                      </div>
                    </>
                  );
                case "multipleSelect":
                  return (
                    <>
                      {i !== 0 && <div className={styles.borderTop}></div>}
                      <div
                        className={`${styles.fieldWrapper} ${
                          i ? styles.borderTop : ""
                        }`}
                        key={field.name}
                      >
                        <Label
                          label={field.label || ""}
                          description={field.description || ""}
                        />
                        <div className={styles.inputWrapper}>
                          <InputMultipleSelectWithoutLabel
                            {...field}
                            control={control}
                            disabled={Boolean(
                              currentItem.id && field.forEditPageDisabled
                            )}
                            options={[
                              { id: "en", name: "en" },
                              { name: "fr", id: "fr" },
                              { name: "de", id: "de" },
                              { name: "es", id: "es" },
                            ]}
                          />
                        </div>
                      </div>
                    </>
                  );
                case "radio":
                  return (
                    <>
                      {i !== 0 && <div className={styles.borderTop}></div>}
                      <div
                        className={`${styles.fieldWrapper} ${
                          i ? styles.borderTop : ""
                        }`}
                        key={field.name}
                      >
                        <Label
                          label={field.label || ""}
                          description={field.description || ""}
                        />
                        <div className={styles.inputWrapper}>
                          <InputRadio {...field} control={control} />
                        </div>
                      </div>
                    </>
                  );
                case "deleteButton":
                  return (
                    <>
                      {i !== 0 && <div className={styles.borderTop}></div>}
                      <div
                        className={`${styles.fieldWrapper} ${
                          i ? styles.borderTop : ""
                        }`}
                        key={field.name}
                      >
                        <Label
                          label={field.label || ""}
                          description={field.description || ""}
                        />
                        <div className={styles.inputWrapper}>
                          <button
                            className="button dangerButton"
                            onClick={handleDeleteClick}
                          >
                            <span className="body-l-medium">
                              {field.placeholder}
                            </span>
                          </button>
                        </div>
                      </div>
                    </>
                  );
                case "textarea":
                  return (
                    <>
                      {i !== 0 && <div className={styles.borderTop}></div>}
                      <div className={styles.fieldWrapper} key={field.name}>
                        <Label
                          label={field.label || ""}
                          description={field.description || ""}
                        />
                        <div className={styles.inputWrapper}>
                          <InputText
                            type={"textarea"}
                            key={field.name}
                            name={field.name}
                            placeholder={field.placeholder}
                          />
                        </div>
                      </div>
                    </>
                  );

                default:
                  return (
                    <>
                      {i !== 0 && <div className={styles.borderTop}></div>}
                      <div className={styles.fieldWrapper} key={field.name}>
                        <Label
                          label={field.label || ""}
                          description={field.description || ""}
                        />
                        <div className={styles.inputWrapper}>
                          <InputText
                            disabled={Boolean(field.disabled)}
                            type={field.type}
                            key={field.name}
                            name={field.name}
                            placeholder={field.placeholder}
                          />
                        </div>
                      </div>
                    </>
                  );
              }
            })} */}
          </form>
        </FormProvider>
      )}

      {openModal && (
        <Appmodal
          openModal={openModal}
          handleCloseModal={() => setOpenModal(false)}
          setOpenModal={setOpenModal}
          modalTitle={modalTitle}
          modalText={modalText}
          confirmWord={confirmWord}
          buttonTitle={buttonTitle}
          confirmSuggestion={confirmText}
          handleAction={handleAction}
        />
      )}
    </>
  );
};

export default EditFields;
const Label = ({
  label,
  description,
}: {
  label: string;
  description: string;
}) => {
  return (
    <div className={styles.labelWrapper}>
      <span className="body-m-medium text-default">{label}</span>
      <span className="body-s-multiline text-secondary">{description}</span>
    </div>
  );
};

interface FieldWrapperProps {
  field: IEditField;
  i: number;
  children: React.ReactNode;
}

const FieldWrapper: React.FC<FieldWrapperProps> = ({ children, field, i }) => (
  <>
    {/* {i !== 0 && <div className={styles.borderTop}></div>} */}
    <div
      className={`${styles.fieldWrapper} ${i ? styles.borderTop : ""}`}
      key={field.name}
    >
      {children}
    </div>
  </>
);
interface RenderFieldProps {
  field: IEditField & { description?: string; disabled?: boolean };
  control: any;
  currentItem: { id?: string };
  i: number;
  handleDeleteClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const renderField = ({
  field,
  control,
  currentItem,
  i,
  handleDeleteClick,
}: RenderFieldProps) => {
  switch (field.type) {
    case "switch":
      return (
        <FieldWrapper field={field} i={i}>
          <Label
            label={field.label || ""}
            description={field.description || ""}
          />
          <div className={styles.inputWrapper}>
            <InputSwitchWithoutLabel
              key={field.name}
              name={field.name}
              control={control}
            />
          </div>
        </FieldWrapper>
      );
    case "select":
      return (
        <FieldWrapper field={field} i={i}>
          <Label
            label={field.label || ""}
            description={field.description || ""}
          />
          <div className={styles.inputWrapper}>
            <InputSelectWithoutLabel
              {...field}
              control={control}
              disabled={Boolean(currentItem.id && field.forEditPageDisabled)}
              options={field.options || []}
            />
          </div>
        </FieldWrapper>
      );

    case "radio":
      return (
        <FieldWrapper field={field} i={i}>
          <Label
            label={field.label || ""}
            description={field.description || ""}
          />
          <div className={styles.inputWrapper}>
            <InputRadio {...field} control={control} />
          </div>
        </FieldWrapper>
      );
    case "deleteButton":
      return (
        <FieldWrapper field={field} i={i}>
          <Label
            label={field.label || ""}
            description={field.description || ""}
          />
          <div className={styles.inputWrapper}>
            <button className="button dangerButton" onClick={handleDeleteClick}>
              <span className="body-l-medium">{field.placeholder}</span>
            </button>
          </div>
        </FieldWrapper>
      );
    case "textarea":
      return (
        <FieldWrapper field={field} i={i}>
          <Label
            label={field.label || ""}
            description={field.description || ""}
          />
          <div className={styles.inputWrapper}>
            <InputText
              type="textarea"
              key={field.name}
              name={field.name}
              placeholder={field.placeholder}
            />
          </div>
        </FieldWrapper>
      );
    default:
      return (
        <FieldWrapper field={field} i={i}>
          <Label
            label={field.label || ""}
            description={field.description || ""}
          />
          <div className={styles.inputWrapper}>
            <InputText
              disabled={Boolean(field.disabled)}
              type={field.type}
              key={field.name}
              name={field.name}
              placeholder={field.placeholder}
            />
          </div>
        </FieldWrapper>
      );
  }
};
