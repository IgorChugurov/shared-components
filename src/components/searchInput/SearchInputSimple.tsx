import React, { useEffect, useRef, useState } from "react";
import styles from "./SearchInput.module.css";
import { useDebounce } from "../../hooks/debounce";
import { Icon_close, IconSearch } from "./Icons";

const SearchInputSimple = ({
  placeholder,
  setSearchState,
  disabled,
}: {
  placeholder: string;
  setSearchState: (d: string) => void;
  disabled?: boolean;
}) => {
  const inputSearchRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState("");
  const debounced = useDebounce(search, 200);
  const clearSearch = () => {
    setSearch("");
    setSearchState("");
    if (inputSearchRef.current) {
      inputSearchRef.current.value = "";
    }
  };

  useEffect(() => {
    setSearchState(debounced);
  }, [debounced]);
  return (
    <div className={styles.buttonContainer1}>
      <div
        className={styles.searchBox}
        onClick={() =>
          inputSearchRef.current &&
          inputSearchRef.current.focus &&
          inputSearchRef.current?.focus()
        }
      >
        <IconSearch
          className={`${styles.searchIcon} ${
            disabled ? "iconInputDisabled" : "iconInput"
          }`}
        />

        <input
          className="custom-input"
          style={{ paddingLeft: "32px" }}
          data-size="small"
          ref={inputSearchRef}
          placeholder={placeholder}
          onChange={(e) => setSearch(e.target.value)}
          disabled={disabled}
        />
        <Icon_close
          onClick={clearSearch}
          className={`${styles.closeIcon} ${
            disabled ? "iconInputDisabled" : "iconInput"
          }`}
        />
      </div>
    </div>
  );
};

export default SearchInputSimple;
