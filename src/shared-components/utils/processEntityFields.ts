import { IEditField, IEntitiesList, IEntityService } from "../types/appdata";

/**
 * Fetches options from a selector using entity service
 * @param selectorSourceId - ID of the selector source
 * @param entityService - Service for entity operations
 * @param sendRequest - Function to make HTTP requests
 * @returns Array of option items
 */
const getOptionsFromSelector = async (
  selectorSourceId: string,
  entityService: IEntityService<any>,
  sendRequest: any
): Promise<any[]> => {
  const sourceEntity = await entityService.getOne(selectorSourceId);

  const req = {
    params: { entityDefinitionId: sourceEntity.id },
    headers: { entityDefinitionId: sourceEntity.id },
    url: sourceEntity.url,
  };
  const response = await sendRequest(req);

  return response.items || response;
};

/**
 * Fetches options for a single field and updates its state
 * @param field - Field configuration object
 * @param entitiesList - List of available entities
 * @param renewData - Function to refresh entity data
 * @param entityService - Service for entity operations
 * @param updateField - Callback to update field state
 * @param sendRequest - Function to make HTTP requests
 */
const getFieldOptions = async (
  field: IEditField,
  entitiesList: IEntitiesList,
  renewData: (collectionName: string) => Promise<void>,
  entityService: IEntityService<any>,
  updateField: (updatedField: IEditField) => void,
  sendRequest: any
): Promise<void> => {
  if (field.type !== "select") return;
  // Set initial loading state
  const updatedField = { ...field, loadOptions: true };
  updateField(updatedField);

  try {
    if (field.collectionName && entitiesList[field.collectionName]) {
      // Handle collection-based options
      await renewData(field.collectionName);
      updateField({
        ...updatedField,
        options: entitiesList[field.collectionName].list,
        loadOptions: false,
      });
    } else if (field.selectorSourceId) {
      // Handle selector-based options

      const options = await getOptionsFromSelector(
        field.selectorSourceId,
        entityService,
        sendRequest
      );
      console.log(options);
      updateField({
        ...updatedField,
        options,
        loadOptions: false,
      });
    } else if (field.options && field.options.length > 0) {
      // Handle predefined options
      updateField({
        ...updatedField,
        loadOptions: false,
      });
    } else {
      // Set empty options array if no options source is available
      updateField({
        ...updatedField,
        options: [],
        loadOptions: false,
      });
    }
  } catch (error) {
    console.error("Error loading options for field:", field.name, error);
    updateField({
      ...updatedField,
      loadOptions: false,
      errorMessage: "Failed to load options",
    });
  }
};

/**
 * Process all entity fields and handle their options loading
 * @param fields - Array of field configurations
 * @param entitiesList - List of available entities
 * @param renewData - Function to refresh entity data
 * @param entityService - Service for entity operations
 * @param setAllFieldsForEntity - State setter for fields
 * @param sendRequest - Function to make HTTP requests
 */
interface IProcessEntityFieldsProps {
  fields: IEditField[];
  entitiesList: IEntitiesList;
  renewData: (collectionName: string) => Promise<void>;
  entityService: IEntityService<any>;
  updateField: (field: IEditField) => void;
  sendRequest: any;
}
export const processEntityFields = ({
  fields,
  entitiesList,
  renewData,
  entityService,
  updateField,
  sendRequest,
}: IProcessEntityFieldsProps): void => {
  // Initialize fields with loading state for select types
  // const initialFields = fields.map((field) => ({
  //   ...field,
  //   loadOptions: field.type === "select" ? true : false,
  // }));

  // setFieldsForEntity(initialFields);

  // // Field update handler
  // const updateField = (updatedField: IEditField) => {

  //   setFieldsForEntity(
  //     currentFields.map((field) =>
  //       field.name === updatedField.name ? updatedField : field
  //     )
  //   );
  // };

  // Start asynchronous options loading for select fields
  fields.forEach((field) => {
    if (field.type === "select") {
      //console.log(field);
      getFieldOptions(
        field,
        entitiesList,
        renewData,
        entityService,
        updateField,
        sendRequest
      );
    }
  });
};
