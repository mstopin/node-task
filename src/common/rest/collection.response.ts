import { ApiProperty } from '@nestjs/swagger';

export class CollectionResponse<T> {
  @ApiProperty()
  public count: number;

  @ApiProperty()
  public page: number;

  @ApiProperty()
  public numberPages: number;

  public data: T[];

  constructor(count: number, page: number, numberPages: number, data: T[]) {
    this.count = count;
    this.page = page;
    this.numberPages = numberPages;
    this.data = data;
  }
}
