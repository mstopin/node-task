import { ApiProperty } from '@nestjs/swagger';

export class SpeciesResponse {
  @ApiProperty()
  public name: string;

  @ApiProperty()
  public classification: string;

  @ApiProperty()
  public designation: string;

  @ApiProperty()
  public averageHeight: number;

  @ApiProperty()
  public averageLifespan: number;

  @ApiProperty()
  public language: string;

  @ApiProperty()
  public homeworld: string | null;

  @ApiProperty({ type: [String] })
  public films: string[];

  @ApiProperty()
  public createdAt: string;

  @ApiProperty()
  public editedAt: string;

  constructor(
    name: string,
    classification: string,
    designation: string,
    averageHeight: number,
    averageLifespan: number,
    language: string,
    homeworld: string | null,
    films: string[],
    createdAt: string,
    editedAt: string,
  ) {
    this.name = name;
    this.classification = classification;
    this.designation = designation;
    this.averageHeight = averageHeight;
    this.averageLifespan = averageLifespan;
    this.language = language;
    this.homeworld = homeworld;
    this.films = films;
    this.createdAt = createdAt;
    this.editedAt = editedAt;
  }
}
