import { ApiProperty } from '@nestjs/swagger';

export class PlanetsResponse {
  @ApiProperty()
  public name: string;

  @ApiProperty()
  public diameter: number;

  @ApiProperty()
  public rotationPeriod: number;

  @ApiProperty()
  public orbitalPeriod: number;

  @ApiProperty()
  public gravity: number;

  @ApiProperty()
  public population: number;

  @ApiProperty({ type: [String] })
  public films: string[];

  @ApiProperty()
  public createdAt: string;

  @ApiProperty()
  public editedAt: string;

  constructor(
    name: string,
    diameter: number,
    rotationPeriod: number,
    orbitalPeriod: number,
    gravity: number,
    population: number,
    films: string[],
    createdAt: string,
    editedAt: string,
  ) {
    this.name = name;
    this.diameter = diameter;
    this.rotationPeriod = rotationPeriod;
    this.orbitalPeriod = orbitalPeriod;
    this.gravity = gravity;
    this.population = population;
    this.films = films;
    this.createdAt = createdAt;
    this.editedAt = editedAt;
  }
}
