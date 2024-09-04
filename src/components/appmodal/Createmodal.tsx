import { Modal } from "@mui/material";

import { useContext, useEffect, useState } from "react";
import styles from "./Appmodal.module.css";

import { FormProvider, useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { GlobalStateContext } from "../../context/GlobalStateProvider";
import { InputSelect } from "../inputs/InputSelect";
import { InputSwitch } from "../inputs/InputSwitch";
import { InputRadio } from "../inputs/InputRadio";
import { InputMultipleSelect } from "../inputs/InputMultipleSelect";
import { InputText } from "../inputs/InputText";
import { IDataForEditPage, IEditField } from "../../types/appdata";
import { createSchema, getItemForEdit } from "../../utils";
import { Icon_window_close } from "./Icons";
interface IProps {
  openModal: boolean;
  handleCloseModal: () => void;
  setOpenModal: (val: boolean) => void;
  handleAction: (data: any) => void;
  fields: IEditField[];
  dataForPage: IDataForEditPage;
  currentItem?: any;
}
// to use this component you neet to provide  array of fields

const Createmodal = ({
  openModal,
  handleCloseModal,
  setOpenModal,
  handleAction,
  dataForPage,
  fields,
  currentItem,
}: IProps) => {
  //console.log(fields);
  const modalTitle = currentItem ? dataForPage.title[1] : dataForPage.title[0];
  const buttontext = currentItem
    ? dataForPage.buttonText?.update || "Update"
    : dataForPage.buttonText?.create || "Create";
  //console.log(modalTitle, fields);
  const [item] = useState<any>(getItemForEdit(fields, currentItem));
  const { darkMode, entitiesList, renewData } = useContext(GlobalStateContext);
  //console.log(entitiesList);

  const resolverSchema = Yup.object().shape(createSchema(fields));
  const methods = useForm({
    mode: "onTouched",
    resolver: yupResolver(resolverSchema),
    defaultValues: item,
  });
  const { control } = methods;

  const onSubmit = methods.handleSubmit(async (data) => {
    setOpenModal(false);
    handleAction(data);
  });
  useEffect(() => {
    renewData("categories");
  }, []);
  const getOptions = (field: IEditField) => {
    if (field.options && field.options.length) {
      // Если у поля уже есть заданные опции, возвращаем их
      return field.options;
    }

    if (field.collectionName && entitiesList[field.collectionName]) {
      return entitiesList[field.collectionName].list;
    }

    return [];
  };
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

          <div className={styles.editContent}>
            <FormProvider {...methods}>
              <form
                onSubmit={onSubmit}
                //onSubmit={methods.handleSubmit(onSubmit, onError)}
                noValidate
                autoComplete="new-password"
                className={styles.form}
              >
                {fields.map((field) => {
                  return (
                    <div className={styles.editBlock} key={field.name}>
                      {field.type === "select" ? (
                        <InputSelect
                          {...field}
                          control={control}
                          options={getOptions(field)}
                        />
                      ) : field.type === "switch" ? (
                        <InputSwitch {...field} control={control} />
                      ) : field.type === "radio" ? (
                        <InputRadio {...field} control={control} />
                      ) : field.type === "array" ? (
                        <InputMultipleSelect
                          {...field}
                          control={control}
                          options={
                            field.collectionName &&
                            entitiesList[field.collectionName]
                              ? entitiesList[field.collectionName].list
                              : []
                          }
                        />
                      ) : (
                        <InputText {...field} />
                      )}
                    </div>
                  );
                })}
              </form>
            </FormProvider>
          </div>

          <div className={styles.footer}>
            <div className={styles.buttonWrapper}>
              <button
                className="button secondaryButton"
                onClick={(e: any) => setOpenModal(false)}
              >
                <span className="body-m-regular">Cancel</span>
              </button>
              <button onClick={onSubmit} className="button primaryButton">
                <span className="body-m-regular">{buttontext}</span>
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Createmodal;
