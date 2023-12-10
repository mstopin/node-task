import {
  Controller,
  DefaultValuePipe,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { CollectionResponse } from 'common/rest/collection.response';
import { ConfigService } from '@nestjs/config';
import { SpeciesResponse } from './species.response';
import { SpeciesService } from '../species.service';
import { Species } from '../species';

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
    return {
      name: species.name,
      classification: species.classification,
      designation: species.designation,
      averageHeight: species.averageHeight,
      averageLifespan: species.averageLifespan,
      language: species.language,
      homeworld: `${this.APP_URL}/planets/${species.homeworldId}`,
      films: species.filmsIds.map((id) => `${this.APP_URL}/films/${id}`),
      createdAt: species.createdAt,
      editedAt: species.editedAt,
    };
  }
}
