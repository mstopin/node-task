import { ApiProperty } from '@nestjs/swagger';

export class VehicleResponse {
  @ApiProperty()
  public name: string;

  @ApiProperty()
  public model: string;

  @ApiProperty()
  public class: string;

  @ApiProperty()
  public manufacturer: string;

  @ApiProperty()
  public length: number;

  @ApiProperty()
  public cost: number;

  @ApiProperty()
  public crew: number;

  @ApiProperty()
  public passengers: number;

  @ApiProperty()
  public cargoCapacity: number;

  @ApiProperty()
  public consumables: string;

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
    length: number,
    cost: number,
    crew: number,
    passengers: number,
    cargoCapacity: number,
    consumables: string,
    films: string[],
    createdAt: string,
    editedAt: string,
  ) {
    this.name = name;
    this.model = model;
    this.class = classType;
    this.manufacturer = manufacturer;
    this.length = length;
    this.cost = cost;
    this.crew = crew;
    this.passengers = passengers;
    this.cargoCapacity = cargoCapacity;
    this.consumables = consumables;
    this.films = films;
    this.createdAt = createdAt;
    this.editedAt = editedAt;
  }
}
