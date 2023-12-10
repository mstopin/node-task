import {
  Controller,
  DefaultValuePipe,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { PlanetsService } from '../planets.service';
import { CollectionResponse } from 'common/rest/collection.response';
import { ConfigService } from '@nestjs/config';
import { PlanetsResponse } from './planets.response';
import { Planet } from '../planet';

@Controller('/planets')
export class PlanetsController {
  private readonly APP_URL: string;

  constructor(
    private readonly planetsService: PlanetsService,
    configService: ConfigService,
  ) {
    this.APP_URL = configService.getOrThrow('APP_URL');
  }

  @Get()
  async find(
    @Query(
      'page',
      new ParseIntPipe({ optional: true }),
      new DefaultValuePipe(1),
    )
    page: number,
    @Query('name')
    name?: string,
  ): Promise<CollectionResponse<PlanetsResponse>> {
    const collection = await this.planetsService.find({
      page,
      name,
    });

    return {
      count: collection.count,
      page: collection.page,
      numberPages: collection.numberPages,
      data: collection.data.map(this.mapDomainToResponse.bind(this)),
    };
  }

  @Get(':id')
  async findOneById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PlanetsResponse> {
    const planet = await this.planetsService.findOneById(id);

    if (!planet) {
      throw new NotFoundException();
    }

    return this.mapDomainToResponse(planet);
  }

  private mapDomainToResponse(planet: Planet): PlanetsResponse {
    return {
      name: planet.name,
      diameter: planet.diameter,
      rotationPeriod: planet.rotationPeriod,
      orbitalPeriod: planet.orbitalPeriod,
      gravity: planet.gravity,
      population: planet.population,
      films: planet.filmsIds.map((id) => `${this.APP_URL}/films/${id}`),
      createdAt: planet.createdAt,
      editedAt: planet.editedAt,
    };
  }
}
