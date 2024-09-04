import React, { useCallback, useContext, useEffect } from "react";
import { GlobalStateContext } from "../../context/GlobalStateProvider";
const ENTITY_NAME = "categories";

const SomeComponent = React.memo(() => {
  const { entitiesList, renewData } = useContext(GlobalStateContext);

  const renewDataCallback = useCallback(() => {
    renewData(ENTITY_NAME);
  }, [renewData, ENTITY_NAME]);

  useEffect(() => {
    console.log("Current entitiesList:", entitiesList);
    renewDataCallback();
  }, []);

  return (
    <div>
      <h2>Category Data:</h2>
      {entitiesList[ENTITY_NAME] && entitiesList[ENTITY_NAME].loading ? (
        <div>Loading...</div>
      ) : (
        <pre>{JSON.stringify(entitiesList[ENTITY_NAME].list, null, 2)}</pre>
      )}
    </div>
  );
});

//   const createItem = (name: string, data: any) => {
//     dispatch({ type: 'CREATE_ITEM', payload: { name, data } });
//   };

//   const deleteItem = (name: string, id: number) => {
//     dispatch({ type: 'DELETE_ITEM', payload: { name, id } });
//   };

//   const deleteMultipleItems = (name: string, ids: number[]) => {
//     dispatch({ type: 'DELETE_MULTIPLE_ITEMS', payload: { name, ids } });
//   };

export default SomeComponent;
