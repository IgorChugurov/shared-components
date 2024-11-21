import { FormProvider, useForm } from "react-hook-form";
import "./FormComponent.css";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { IEditField } from "../../types/appdata";
import { useMemo } from "react";
import { createSchema } from "../../utils/createSchema";
import { removeNoneOptions } from "../../utils/removeNoneOptions";
import GetInputForField from "../GetInputForField/GetInputForField";
interface IItem {
  id?: string;
  name: string;
  createdAt: string;
  [key: string]: any;
}
interface EntityFormProps {
  fields: IEditField[];
  currentItem: IItem;
  onSubmit: (data: any) => Promise<void>;
  onDelete?: () => void;
  onCancel: () => void;
  pageTitle: string;
  buttonTitle: string;
  showDeleteButton?: boolean;
}

const EntityForm: React.FC<EntityFormProps> = ({
  fields,
  currentItem,
  onSubmit,
  onDelete,
  onCancel,
  pageTitle,
  buttonTitle,
  showDeleteButton = false,
}) => {
  const resolverSchema = useMemo(
    () => Yup.object().shape(createSchema(fields)),
    [fields]
  );

  const methods = useForm({
    mode: "onTouched",
    resolver: yupResolver(resolverSchema),
    defaultValues: currentItem,
  });

  const handleSubmit = methods.handleSubmit(async (data) => {
    const cleanData = removeNoneOptions(data, fields);
    await onSubmit(cleanData);
  });

  return (
    <div className="form-container-for-create-update-any-item">
      <div className="header">
        <span className="body-l-medium">{pageTitle}</span>
        <div className="buttonsWrpper">
          <button
            className="button primaryButton"
            onClick={handleSubmit}
            data-size="small"
          >
            <span className="body-m-medium">{buttonTitle}</span>
          </button>

          {showDeleteButton && (
            <button
              data-outlined="true"
              data-size="small"
              className="button dangerButton"
              onClick={onDelete}
            >
              <span className="body-l-medium">Delete</span>
            </button>
          )}

          <button
            className="button secondaryButton"
            onClick={onCancel}
            data-size="small"
          >
            <span className="body-m-medium">Cancel</span>
          </button>
        </div>
      </div>

      <FormProvider {...methods}>
        <form
          onSubmit={(e) => e.preventDefault()}
          noValidate
          autoComplete="off"
          className="form"
        >
          {fields.map((field) => (
            <div className="input_container_for_from" key={field.name}>
              <GetInputForField
                currentItem={currentItem}
                field={field}
                control={methods.control}
              />
            </div>
          ))}
        </form>
      </FormProvider>
    </div>
  );
};
export default EntityForm;
