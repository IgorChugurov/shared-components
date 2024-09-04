/**
 * ServicePackage.ts
 *
 * This file defines the ApiService class, responsible for handling all CRUD operations
 * for entities defined in the appdata.json's EntitiesForListAndServicesPackageAndEditPage.
 * Each entity can utilize this service to interact with its respective backend API endpoints.
 * Additionally, this service setup is used to generate routes (main.ts) for listing and editing pages dynamically.
 */

import { sendRequest } from "./request";
import { IListResponse, IPaginate } from "../types/request";
import { initConfig } from "../config/initConfig";

const { EntitiesForListAndServicesPackageAndEditPage } = initConfig;

export interface IApiService<T> {
  deleteMany: (d: any) => Promise<any>;
  deleteOne: (d: string) => Promise<any>;
  updagteOne: (d: T) => Promise<T>;
  createOne: (d: T) => Promise<T>;
  getOne: (d: string) => Promise<T>;
  getAll: () => Promise<T[]>;
}

export class ApiService<T> {
  constructor(
    private endpoint: string,
    private reloadEvents?: any //{ delete: "reloadItems" }, use it in the future in createUpdateDeleteAnyEntity.ts
  ) {}

  getAll = (options?: any): Promise<T[]> => {
    return new Promise((resolve, reject) => {
      const req = {
        url: `${this.endpoint}`,
        method: "GET",
        headers: options?.headers,
        params: options?.params,
      };

      sendRequest(req).then(resolve, reject);
    });
  };
  getMany = (paginate?: IPaginate, params?: any): Promise<IListResponse<T>> => {
    return new Promise((resolve, reject) => {
      const req = {
        url: `${this.endpoint}`,
        method: "GET",
        queryString: paginate?.query,
        currentPage: paginate?.currentPage,
        perPage: paginate?.perPage,
        search: paginate?.search,
        limit: paginate?.perPage,
        params: params,
        skip:
          (paginate?.perPage || 0) *
          (paginate?.currentPage ? paginate?.currentPage - 1 : 0),
      };

      sendRequest(req).then(resolve, reject);
    });
  };

  getOne = (id: string): Promise<T> => {
    return new Promise((resolve, reject) => {
      const req = {
        url: `${this.endpoint}/${id}`,
        method: "GET",
      };
      sendRequest(req).then(resolve, reject);
    });
  };

  createOne = (body: Omit<T, "id">): Promise<T> => {
    const url = this.endpoint;
    return new Promise((resolve, reject) => {
      const req = {
        url: url,
        method: "POST",
        body,
      };
      sendRequest(req).then(resolve, reject);
    });
  };

  updateOne = (id: string, body: T): Promise<T> => {
    return new Promise((resolve, reject) => {
      const req = {
        url: `${this.endpoint}/${id}`,
        method: "PATCH",
        body,
      };
      sendRequest(req).then(resolve, reject);
    });
  };
  updateAll = (body: T, options?: any): Promise<T> => {
    return new Promise((resolve, reject) => {
      const req = {
        url: `${this.endpoint}`,
        method: "PATCH",
        params: options?.params,
        body,
      };
      sendRequest(req).then(resolve, reject);
    });
  };

  deleteOne = (id: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const req = {
        url: `${this.endpoint}/${id}`,
        method: "DELETE",
      };
      sendRequest(req).then(resolve, reject);
    });
  };

  deleteMany = (body: { ids: string[] }): Promise<void> => {
    return new Promise((resolve, reject) => {
      const req = {
        url: `${this.endpoint}/delete-many`,
        method: "PUT",
        body,
      };
      sendRequest(req).then(resolve, reject);
    });
  };
}
const arrForServicesPackage = EntitiesForListAndServicesPackageAndEditPage.map(
  (d) => ({ ...d.forServicePackage, collectionName: d.collectionName })
);
export const servicesPackage: { [key: string]: ApiService<any> } =
  Object.fromEntries(
    arrForServicesPackage.map((d) => [
      d.collectionName,
      new ApiService<any>(d.url, d.reloadEvents),
    ])
  );
