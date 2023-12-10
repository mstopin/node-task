import {
  Controller,
  DefaultValuePipe,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { StarshipResponse } from './vehicles.response';
import { CollectionResponse } from 'common/rest/collection.response';
import { ConfigService } from '@nestjs/config';
import { StarshipsService } from '../starships.service';
import { Starship } from '../starship';

@Controller('/starships')
export class StarshipsController {
  private readonly APP_URL: string;

  constructor(
    private readonly starshipsService: StarshipsService,
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
  ): Promise<CollectionResponse<StarshipResponse>> {
    const collection = await this.starshipsService.find({
      page,
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
  ): Promise<StarshipResponse> {
    const starship = await this.starshipsService.findOneById(id);

    if (!starship) {
      throw new NotFoundException();
    }

    return this.mapDomainToResponse(starship);
  }

  private mapDomainToResponse(starship: Starship): StarshipResponse {
    return {
      name: starship.name,
      model: starship.model,
      class: starship.class,
      manufacturer: starship.manufacturer,
      cost: starship.cost,
      length: starship.length,
      crew: starship.crew,
      passengers: starship.passengers,
      films: starship.filmsIds.map((id) => `${this.APP_URL}/films/${id}`),
      createdAt: starship.createdAt,
      editedAt: starship.editedAt,
    };
  }
}
