import { IEditField } from "../types/appdata";
import { IEntity } from "../types/entity";

//here we crete initData for entity item
export const getInitDataItem = (item: IEntity, fieldsForEdit: IEditField[]) => {
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
      searchBlock: "Search for items",

      buttonBlock: { title: "New item" },
      columnsForGrid: [
        {
          field: "name",
          headerName: "Name",
          flex: 1,
          type: "openEditPage",
        },

        {
          field: "actions",
          headerName: "",
          type: "actions",
          width: 100,
          options: {
            actions: [
              {
                action: "edit",
              },
            ],
          },
        },
      ],
      forEmptyList: {
        title: "You have no itemss",
        messages: [
          "Itemss that you create will end up here.",
          "Add a itemss to get started.",
        ],
      },
      messages: {
        afterCreate: "Item was created successfully!",
        afterDelete: "Item was deleted successfully!",
        afterEdit: "Item was updated successfully!",
        forDeleteModal: {
          modalText:
            "Are you sure you want to delete ${item.name}? This action cannot be undone.",
          modalTitle: "Confirm deleting item",
          buttonTitle: "Delete",
        },
      },
    },
    forEdit: {
      title: ["Create new item", "Edit item"],
      pageHeader: "Field details",
      buttonText: { create: "Create", edit: "Update" },
      sections: [
        {
          title: "Item information",
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
