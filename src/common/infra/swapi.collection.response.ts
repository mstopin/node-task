export interface SwapiCollectionResponse<T> {
  count: number;
  next: string;
  previous: string;
  results: T[];
}
