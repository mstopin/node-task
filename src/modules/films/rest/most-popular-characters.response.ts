import { ApiProperty } from '@nestjs/swagger';

export class MostPopularCharactersResponse {
  @ApiProperty()
  public characters: string[];

  constructor(characters: string[]) {
    this.characters = characters;
  }
}
