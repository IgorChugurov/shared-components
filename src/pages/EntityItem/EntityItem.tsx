import React, { useContext, useEffect, useState } from "react";
import { IEditField, IOptionsListItem } from "../../types/appdata";
import { servicesPackage, ApiService } from "../../services/servicesPackage";
import { GlobalStateContext } from "../../context/GlobalStateProvider";
import { getAnyEntity } from "../../utils/createUpdateDeleteAnyEntity";
import { IEntity } from "../../types/entity";
import SearchInputSimple from "../../components/searchInput/SearchInputSimple";
import ListsItemsInTab from "../../components/listItemsInTab/ListItemsInTab";
import { Icon_add } from "../../components/icons/Icons";
import "./EntityItem.css";
import CreateItem from "../../components/createItem/CreateItem";
import { getItemForEdit } from "../../utils";
import { getFieldsWithProjectSettings } from "../../utils/getItemForEdit";
import { fields } from "@hookform/resolvers/ajv/src/__tests__/__fixtures__/data.js";

const EntityItem = ({
  initDataEntity,
  initDataFields,
}: {
  initDataEntity: IOptionsListItem;
  initDataFields: IOptionsListItem;
}) => {
  const { collectionName: entityCollectionName } = initDataEntity;
  const { collectionName: fieldsCollectionName } = initDataFields;
  const entityService = servicesPackage[entityCollectionName];
  const settingService = servicesPackage["projectSettings"];

  const fieldsService = servicesPackage[fieldsCollectionName];
  const { changeRouteData, routeData } = useContext(GlobalStateContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchState, setSearchState] = useState<string>("");
  const entityId = location.pathname.split("/")[4];
  const [itemEntity, setItemEntity] = useState<IEntity | null>(null);
  const [itemFromServerForEdit, setItemFromServerForEdit] = useState<any>(null);

  const [allFieldsForEntity, setAllFieldsForEntity] = useState<IEditField[]>(
    []
  );
  const [forEditFields, setForEditFields] = useState<any>([]);
  const [modalCreateOpen, setModalCreateOpen] = useState(false);

  const [placeholder, setPlaceholder] = useState<string>("Search ...");
  const [buttonTitle, setButtonTitle] = useState<string>("Create new item");

  const [initDataItem, setInitDataItem] = useState<IOptionsListItem>(
    {} as IOptionsListItem
  );

  const [currentItem, setCurrentItem] = useState<any>(null);

  const [projectSettings, setProjectSettings] = useState<any>({
    languages: ["en", "de", "fr", "es", "it", "ru"],
    defaultLang: "en",
    emails: "",
    emailNotification: true,
  });

  const createNewItem = () => {
    setItemFromServerForEdit(null);
    setCurrentItem(null);
    setModalCreateOpen(true);
  };

  // get entity  , fields and settings for this project
  useEffect(() => {
    // here we get get entity  , fields and settings for this project
    if (entityService && fieldsService) {
      changeRouteData({ entity: null });
      setLoading(true);
      getAnyEntity(entityId, entityService)
        .then((res) => {
          // get entity by id and set it to the state
          const entity: IEntity = res as unknown as IEntity;
          setLoading(false);
          changeRouteData({ entity: entity });
          setItemEntity(entity);
          console.log(entity);
          if (entity) {
            // create service for items  this entity
            servicesPackage[entity.tableName] = new ApiService<any>(
              "/api/groups",
              "reloadItems"
            );
          }
        })
        .then(() => {
          const options = { params: { entityDefinitionId: entityId } };
          return fieldsService.getAll(options);
        })
        .then((res: any) => {
          // get all fields for this entity and add forCreatePage and forEditPage
          setAllFieldsForEntity(res.items);
        })
        .then(() => {
          // get all settings for this project
          return settingService.getAll();
        })
        .then((res) => {
          setProjectSettings(res);
        })
        .catch((err: any) => {
          console.log(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, []);
  // then we create initData for entity item and set fields for edit based on project settings and fields for entity from server
  useEffect(() => {
    if (itemEntity && allFieldsForEntity) {
      const allFieldsWithLangs = getFieldsWithProjectSettings(
        allFieldsForEntity,
        projectSettings
      );
      const initData = getInitDataItem(itemEntity, allFieldsWithLangs);
      setForEditFields(allFieldsWithLangs);
      setInitDataItem(initData);
    }
  }, [itemEntity, allFieldsForEntity, projectSettings]);

  // then we watch for currentItem and if it is changed we get item from server and set it for edit due to project settings

  useEffect(() => {
    const itemsService = servicesPackage[itemEntity?.tableName || ""];
    if (currentItem && currentItem.id) {
      getAnyEntity(currentItem.id, itemsService).then((res: any) => {
        const data = getItemForEdit(allFieldsForEntity, res, projectSettings);
        setItemFromServerForEdit(data);
      });
    } else {
      const data = getItemForEdit(allFieldsForEntity, null, projectSettings);
      setItemFromServerForEdit(data);
    }
  }, [currentItem]);

  return (
    <React.Fragment>
      {modalCreateOpen && (
        <CreateItem
          initAllFields={forEditFields}
          dataForEditPage={initDataItem.forEdit}
          messages={{}}
          currentItem={itemFromServerForEdit}
          openModal={modalCreateOpen}
          handleCloseModal={() => setModalCreateOpen(false)}
          setOpenModal={setModalCreateOpen}
          itemsService={servicesPackage[itemEntity?.tableName || ""]}
          parentEntityId={entityId}
        />
      )}
      <div className={`entityItem-container`}>
        <div className="entityItem-header">
          <SearchInputSimple
            disabled={loading}
            setSearchState={setSearchState}
            placeholder={placeholder}
          />
          <button
            data-size="small"
            className="button primaryButton"
            onClick={() => {
              createNewItem();
            }}
            disabled={loading}
          >
            <Icon_add />
            <span className="body-m-medium">{buttonTitle}</span>
          </button>
        </div>

        {initDataItem && initDataItem.collectionName && (
          <ListsItemsInTab
            initData={initDataItem}
            searchState={searchState}
            setModalCreateOpen={setModalCreateOpen}
            setCurrentItem={setCurrentItem}
          />
        )}
      </div>
    </React.Fragment>
  );
};

export default EntityItem;

//here we crete initData for entity item
const getInitDataItem = (item: IEntity, fieldsForEdit: IEditField[]) => {
  const initData = {
    title: item.name,
    collectionName: item.tableName,
    forServicePackage: {
      url: "/api/groups", // item.url

      reloadEvents: {
        update: "reloadItems",
        create: "reloadItems",
        delete: "reloadItems",
      },
    },
    reloadEventTitle: "reloadItmes",
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
