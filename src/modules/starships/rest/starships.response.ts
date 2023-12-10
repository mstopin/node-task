import { ApiProperty } from '@nestjs/swagger';

export class StarshipResponse {
  @ApiProperty()
  public name: string;

  @ApiProperty()
  public model: string;

  @ApiProperty()
  public class: string;

  @ApiProperty()
  public manufacturer: string;

  @ApiProperty()
  public cost: number;

  @ApiProperty()
  public length: number;

  @ApiProperty()
  public crew: number;

  @ApiProperty()
  public passengers: number;

  @ApiProperty({ type: [String] })
  public films: string[];

  @ApiProperty()
  public createdAt: string;

  @ApiProperty()
  public editedAt: string;

  constructor(
    name: string,
    model: string,
    classType: string,
    manufacturer: string,
    cost: number,
    length: number,
    crew: number,
    passengers: number,
    films: string[],
    createdAt: string,
    editedAt: string,
  ) {
    this.name = name;
    this.model = model;
    this.class = classType;
    this.manufacturer = manufacturer;
    this.cost = cost;
    this.length = length;
    this.crew = crew;
    this.passengers = passengers;
    this.films = films;
    this.createdAt = createdAt;
    this.editedAt = editedAt;
  }
}
