import { IEditField } from "../types/appdata";
import { IEntity } from "../types/entity";

//here we crete initData for entity item
export const getInitDataForDatasetFromEntity = (
  item: IEntity,
  fieldsForEdit: IEditField[]
) => {
  //console.log(getColumnsFromFields(fieldsForEdit));
  const initData = {
    title: item.name,
    collectionName: item.tableName,
    forServicePackage: {
      url: item.url,

      reloadEvents: {
        update: `reloadItems${item.tableName}`,
        create: `reloadItems${item.tableName}`,
        delete: `reloadItems${item.tableName}`,
      },
    },
    reloadEventTitle: `reloadItems${item.tableName}`,
    forList: {
      searchBlock: `Search for ${item.name.toLowerCase()}`,

      buttonBlock: { title: `New ${item.name.toLowerCase()}` },
      columnsForGrid: [
        ...getColumnsFromFields(fieldsForEdit),
        // {
        //   field: "name",
        //   headerName: "Name",
        //   flex: 1,
        //   type: "openEditPage",
        // },

        {
          field: "actions",
          headerName: "",
          type: "actions",
          width: 100,
          options: {
            actions: [
              {
                action: "edit",
                link: true,
              },
            ],
          },
        },
      ],
      forEmptyList: {
        title: `You have no ${item.name.toLowerCase()}s`,
        messages: [
          `${item.name}s that you create will end up here.`,
          `Add a ${item.name.toLowerCase()}s to get started.`,
        ],
      },
      messages: {
        afterCreate: `${item.name} was created successfully!`,
        afterDelete: `${item.name} was deleted successfully!`,
        afterEdit: `${item.name} was updated successfully!`,
        forDeleteModal: {
          modalText:
            "Are you sure you want to delete ${item.name}? This action cannot be undone.",
          modalTitle: `Confirm deleting ${item.name.toLowerCase()}`,
          buttonTitle: "Delete",
        },
      },
    },
    forEdit: {
      title: [
        `Create new ${item.name.toLowerCase()}`,
        `Edit ${item.name.toLowerCase()}`,
      ],
      pageHeader: "Field details",
      buttonText: { create: "Create", edit: "Update" },
      sections: [
        {
          title: `${item.name} information`,
          fields: fieldsForEdit,
        },
        {
          title: "Deletion",
          button: {
            action: "delete",
            title: "Delete item",
            options: {
              modalText: "Are you sure you want to delete ${item.name}?",
              modalTitle: "Confirm deleting!",
              confirmWord: "Delete!",
              confirmText: "To confirm, please type the word Delete!",
            },
          },
          fields: [],
        },
      ],
    },
  };

  return initData;
};

const getColumnsFromFields = (fields: IEditField[]) => {
  return fields
    .filter((field) => field.displayInTable)
    .map((field, i) => {
      return {
        type: i === 0 ? "naigateToDetails" : undefined,
        field: field.name,
        headerName: field.label || "Name",
        flex: 1,
      };
    });
};
