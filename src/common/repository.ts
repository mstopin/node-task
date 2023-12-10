export interface Repository<T> {
  findOneById(id: number): Promise<T | null>;
  find(): Promise<T[]>;
}
