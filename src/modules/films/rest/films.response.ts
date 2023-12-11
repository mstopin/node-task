import { ApiProperty } from '@nestjs/swagger';

export class FilmResponse {
  @ApiProperty()
  public title: string;

  @ApiProperty()
  public episodeId: number;

  @ApiProperty()
  public opening: string;

  @ApiProperty()
  public director: string;

  @ApiProperty()
  public producer: string;

  @ApiProperty()
  public releasedAt: string;

  @ApiProperty({ type: [String] })
  public planets: string[];

  @ApiProperty({ type: [String] })
  public starships: string[];

  @ApiProperty({ type: [String] })
  public vehicles: string[];

  @ApiProperty({ type: [String] })
  public species: string[];

  @ApiProperty()
  public createdAt: string;

  @ApiProperty()
  public editedAt: string;

  constructor(
    title: string,
    episodeId: number,
    openingCrawl: string,
    director: string,
    producer: string,
    releasedAt: string,
    planets: string[],
    starships: string[],
    vehicles: string[],
    species: string[],
    createdAt: string,
    editedAt: string,
  ) {
    this.title = title;
    this.episodeId = episodeId;
    this.opening = openingCrawl;
    this.director = director;
    this.producer = producer;
    this.releasedAt = releasedAt;
    this.planets = planets;
    this.starships = starships;
    this.vehicles = vehicles;
    this.species = species;
    this.createdAt = createdAt;
    this.editedAt = editedAt;
  }
}
