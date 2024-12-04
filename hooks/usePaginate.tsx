import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";

import { IPaginate } from "../types/request";
import { setError } from "../utils/sendMessage";
import { INIT_PAGINATE } from "../constants/constants";

interface ItemData {
  id: string;
  [key: string]: any;
}
interface ApiResponse {
  items?: ItemData[];
  meta?: {
    totalItems: number;
    totalPages: number;
  };
}

interface UsePaginateProps {
  searchState: string;
  options?: {
    headers?: Record<string, unknown>;
    params?: Record<string, unknown>;
  };

  itemsService: {
    getMany: (
      paginate: IPaginate,

      options: {
        signal: AbortSignal;
        headers?: Record<string, unknown>;
        params?: Record<string, unknown>;
      }
    ) => Promise<ApiResponse>;
  };
  reloadEventTitle?: string;
}

export const usePaginate = ({
  searchState,
  options = {},

  itemsService,
  reloadEventTitle,
}: UsePaginateProps) => {
  const [savedParams, setSavedParams] = useState<Record<string, unknown>>(
    options?.params || {}
  );
  const [items, setItems] = useState<ItemData[]>([]);
  const [paginate, setPaginate] = useState<IPaginate>({
    ...INIT_PAGINATE,
    search: searchState,
  });
  //console.log(options);

  // Ref for storing current AbortController
  const abortControllerRef = useRef<AbortController | null>(null);

  // Function to fetch items with abort controller support
  const fetchItems = async (
    paginateData: IPaginate,
    options: {
      headers?: Record<string, unknown>;
      params?: Record<string, unknown>;
    }
  ) => {
    //console.log("first fetchItems");
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      const res = await itemsService.getMany(paginateData, {
        ...options,
        signal: abortController.signal,
      });

      if (!abortController.signal.aborted) {
        const data = res.items ? res.items : Array.isArray(res) ? res : [];
        setItems(data);

        setPaginate((prev) => ({
          ...prev,
          currentPage: paginateData.currentPage,
          perPage: paginateData.perPage,
          totalItems: res.meta?.totalItems ?? 0,
          totalPages: res.meta?.totalPages ?? 0,
          loaded: true,
        }));
      }
    } catch (err: unknown) {
      const error = err as Error;
      if (error.name === "AbortError") return;
      // Handle other errors here
      console.error(error);
      setError(error.message || "Some error occurred while fetching items");
      setTimeout(() => setError(""), 5000);
    } finally {
      if (abortControllerRef.current === abortController) {
        abortControllerRef.current = null;
      }
    }
  };

  // Handle params changes
  useEffect(() => {
    const hasParamsChanged = !isEqual(options?.params || {}, savedParams);
    if (hasParamsChanged) {
      setSavedParams(options?.params || {});
      setPaginate((prev) => ({ ...prev, loaded: false }));
    }
  }, [options?.params]);

  // Handle search state changes
  useEffect(() => {
    if (!paginate.search && !searchState) return;

    const newPagination: IPaginate = {
      ...paginate,
      search: searchState || undefined,
      loaded: false,
      currentPage: 1,
    };

    setPaginate(newPagination);
  }, [searchState]);

  // Handle data fetching
  useEffect(() => {
    if (!paginate.loaded) {
      fetchItems(paginate, options);
    }

    return () => {
      abortControllerRef.current?.abort();
    };
  }, [paginate.loaded, itemsService, options]);

  // Handle reload events
  useEffect(() => {
    if (!reloadEventTitle) return;

    const handleReload = () => {
      setPaginate((prev) => ({ ...prev, loaded: false }));
    };

    window.addEventListener(reloadEventTitle, handleReload);
    return () => window.removeEventListener(reloadEventTitle, handleReload);
  }, [reloadEventTitle]);

  const handlePaginationModelChange = useCallback(
    (data: { page: number; pageSize: number }) => {
      setPaginate((prev) => ({
        ...prev,
        currentPage: data.page + 1,
        perPage: data.pageSize,
        loaded: false,
      }));
    },
    []
  );

  const memoizedItems = useMemo(() => items, [items]);

  return {
    items: memoizedItems,
    paginate,
    setPaginate,
    handlePaginationModelChange,
  };
};

// Deep comparison function
const isEqual = <T extends Record<string, unknown>>(
  obj1: T,
  obj2: T
): boolean => {
  const obj1Keys = Object.keys(obj1);
  const obj2Keys = Object.keys(obj2);

  if (obj1Keys.length !== obj2Keys.length) return false;

  return obj1Keys.every((key) => obj1[key] === obj2[key]);
};
