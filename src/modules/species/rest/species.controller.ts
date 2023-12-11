import {
  Controller,
  DefaultValuePipe,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { CollectionResponse } from '../../../common/rest/collection.response';
import { ConfigService } from '@nestjs/config';
import { SpeciesResponse } from './species.response';
import { SpeciesService } from '../species.service';
import { Species } from '../species';
import { ApiNotFoundResponse, ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import { ApiOkCollectionResponse } from '../../../common/rest/api-ok-collection.response';

@Controller('/species')
export class SpeciesController {
  private readonly APP_URL: string;

  constructor(
    private readonly speciesService: SpeciesService,
    configService: ConfigService,
  ) {
    this.APP_URL = configService.getOrThrow('APP_URL');
  }

  @Get()
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'name', required: false })
  @ApiOkCollectionResponse(SpeciesResponse, {
    description: 'Returns all species',
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
  ): Promise<CollectionResponse<SpeciesResponse>> {
    const collection = await this.speciesService.find({
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
  @ApiOkResponse({
    description: 'Returns one species with specified id',
    type: SpeciesResponse,
  })
  @ApiNotFoundResponse({
    description: 'Species with specified id was not found',
  })
  async findOneById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SpeciesResponse> {
    const species = await this.speciesService.findOneById(id);

    if (!species) {
      throw new NotFoundException();
    }

    return this.mapDomainToResponse(species);
  }

  private mapDomainToResponse(species: Species): SpeciesResponse {
    return new SpeciesResponse(
      species.name,
      species.classification,
      species.designation,
      species.averageHeight,
      species.averageLifespan,
      species.language,
      species.homeworldId
        ? `${this.APP_URL}/planets/${species.homeworldId}`
        : null,
      species.filmsIds.map((id) => `${this.APP_URL}/films/${id}`),
      species.createdAt,
      species.editedAt,
    );
  }
}
