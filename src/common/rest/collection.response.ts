export interface CollectionResponse<T> {
  count: number;
  page: number;
  numberPages: number;
  data: T[];
}
