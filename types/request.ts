export interface IPaginate {
  totalItems: number;
  perPage: number;
  totalPages?: number;
  currentPage: number;
  search?: string;
  loaded?: boolean;
  query?: { [key: string]: any };
}
export interface IListResponse<T> {
  totalItems: number;
  perPage: number;
  totalPages?: number;
  currentPage: number;
  items: T[];
}
