export abstract class Repository<T> {
  abstract findOneById(id: number): Promise<T | null>;
  abstract find(): Promise<T[]>;
}
