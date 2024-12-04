import React, { useEffect, useRef, useState } from "react";
import styles from "./SearchInput.module.css";
import { useDebounce } from "../../hooks/debounce";

import { IPaginate } from "../../types/request";
import { IconSearch } from "./Icons";

const SearchInput = ({
  placeholder,
  paginate,
  setPaginate,
  rowSelectionModel,
  setOpenConfirmModal,
  setAllItems,
  allItems,
  items,
  disabled,
}: {
  placeholder: string;
  paginate: IPaginate;
  setPaginate: (d: any) => void;
  rowSelectionModel?: string[];
  setAllItems?: (d: any) => void;
  allItems?: boolean;
  setOpenConfirmModal?: (d: boolean) => void;
  items?: any[];
  disabled?: boolean;
}) => {
  const inputSearchRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState("");
  const debounced = useDebounce(search, 700);

  useEffect(() => {
    if (!paginate.search && !debounced) {
      return;
    }
    const tempPagination = Object.assign({}, paginate);
    tempPagination.search = debounced;
    if (!tempPagination.search) {
      delete tempPagination.search;
    }
    tempPagination.loaded = false;
    tempPagination.currentPage = 1;
    setPaginate(tempPagination);
  }, [debounced]);
  return (
    <div className={styles.buttonContainer}>
      <div
        className={styles.searchBox}
        onClick={() =>
          inputSearchRef.current &&
          inputSearchRef.current.focus &&
          inputSearchRef.current?.focus()
        }
      >
        <IconSearch className={styles.searchIcon} />

        <input
          className="custom-input"
          style={{ paddingLeft: "32px" }}
          data-size="small"
          ref={inputSearchRef}
          placeholder={placeholder}
          onChange={(e) => setSearch(e.target.value)}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default SearchInput;
