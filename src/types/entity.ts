export interface IEntity {
  id: string;
  name: string;
  url: string;
  description?: string;
  tableName: string;
  type: "primary" | "secondary" | "tertiary";
}
