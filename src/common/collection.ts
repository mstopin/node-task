export class Collection<T> {
  private readonly PAGE_SIZE = 10;

  public readonly numberPages: number;

  constructor(
    public readonly count: number,
    public readonly page: number,
    public readonly data: T[],
  ) {
    this.numberPages = Math.ceil(this.count / this.PAGE_SIZE);
  }

  static empty<T>(): Collection<T> {
    return new Collection(0, 0, []);
  }
}
