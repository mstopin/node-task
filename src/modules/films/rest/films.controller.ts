import {
  Controller,
  DefaultValuePipe,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { FilmsService } from '../films.service';
import { FilmResponse } from './films.response';
import { CollectionResponse } from 'common/rest/collection.response';
import { Film } from '../film';
import { ConfigService } from '@nestjs/config';

@Controller('/films')
export class FilmsController {
  private readonly APP_URL: string;

  constructor(
    private readonly filmsService: FilmsService,
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
    @Query('title')
    title?: string,
  ): Promise<CollectionResponse<FilmResponse>> {
    const collection = await this.filmsService.find({
      page,
      title,
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
  ): Promise<FilmResponse> {
    const film = await this.filmsService.findOneById(id);

    if (!film) {
      throw new NotFoundException();
    }

    return this.mapDomainToResponse(film);
  }

  private mapDomainToResponse(film: Film): FilmResponse {
    return {
      title: film.title,
      episodeId: film.episodeId,
      openingCrawl: film.openingCrawl,
      director: film.director,
      producer: film.producer,
      releasedAt: film.releasedAt,
      planets: film.planetsIds.map((id) => `${this.APP_URL}/planets/${id}`),
      starships: film.starshipsIds.map(
        (id) => `${this.APP_URL}/starships/${id}`,
      ),
      vehicles: film.vehiclesIds.map((id) => `${this.APP_URL}/vehicles/${id}`),
      species: film.speciesIds.map((id) => `${this.APP_URL}/species/${id}`),
      createdAt: film.createdAt,
      editedAt: film.editedAt,
    };
  }
}
