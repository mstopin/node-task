import {
  Controller,
  DefaultValuePipe,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { StarshipResponse } from './starships.response';
import { CollectionResponse } from '../../../common/rest/collection.response';
import { ConfigService } from '@nestjs/config';
import { StarshipsService } from '../starships.service';
import { Starship } from '../starship';
import { ApiNotFoundResponse, ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import { ApiOkCollectionResponse } from '../../../common/rest/api-ok-collection.response';

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
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'name', required: false })
  @ApiQuery({ name: 'model', required: false })
  @ApiOkCollectionResponse(StarshipResponse, {
    description: 'Returns all starships',
  })
  async find(
    @Query(
      'page',
      new ParseIntPipe({ optional: true }),
      new DefaultValuePipe(1),
    )
    page: number,
    @Query('name')
    name?: string,
    @Query('model')
    model?: string,
  ): Promise<CollectionResponse<StarshipResponse>> {
    const collection = await this.starshipsService.find({
      page,
      name,
      model,
    });

    return {
      count: collection.count,
      page: collection.page,
      numberPages: collection.numberPages,
      data: collection.data.map(this.mapDomainToResponse.bind(this)),
    };
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Returns one starship with specified id',
    type: StarshipResponse,
  })
  @ApiNotFoundResponse({
    description: 'Starship with specified id was not found',
  })
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
    return new StarshipResponse(
      starship.name,
      starship.model,
      starship.class,
      starship.manufacturer,
      starship.cost,
      starship.length,
      starship.crew,
      starship.passengers,
      starship.filmsIds.map((id) => `${this.APP_URL}/films/${id}`),
      starship.createdAt,
      starship.editedAt,
    );
  }
}
