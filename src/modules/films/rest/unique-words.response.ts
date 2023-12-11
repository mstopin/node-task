import { ApiProperty } from '@nestjs/swagger';

export class UniqueWordsResponse {
  @ApiProperty({ type: [String, Number] })
  public words: [string, number][];

  constructor(words: Map<string, number>) {
    this.words = Array.from(words.entries());
  }
}
