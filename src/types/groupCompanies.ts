export interface IGroupCompanies {
  id: string;
  name: string;
  companies: ICompany[];
  companiesQty: number;
  updatedAt: string;
  createdAt: string;
}

export interface ICompany {
  id: string;
  name: string;
  updatedAt: string;
  createdAt: string;
}
export interface IAdmin {
  id: string;
  name: string;
  email: string;
  updatedAt: string;
  createdAt: string;
}
export interface ISettings {
  id: string;
  name: string;
  updatedAt: string;
  createdAt: string;
  [key: string]: any;
}
