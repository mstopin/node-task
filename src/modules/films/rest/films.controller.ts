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
import { ApiNotFoundResponse, ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import { ApiOkCollectionResponse } from 'common/rest/api-ok-collection.response';
import { UniqueWordsResponse } from './unique-words.response';

@Controller('/films')
export class FilmsController {
  private readonly APP_URL: string;

  constructor(
    private readonly filmsService: FilmsService,
    configService: ConfigService,
  ) {
    this.APP_URL = configService.getOrThrow('APP_URL');
  }

  @Get('/openings-unique-words')
  @ApiOkResponse({
    description:
      'returs an array of pairs of unique words from all films openings paired with their number of occurrences in the text',
    type: UniqueWordsResponse,
  })
  async findOpeningsUniqueWordsWithOccurences() {
    const openingsUniqueWords =
      await this.filmsService.findOpeningsUniqueWordsWithOccurences();

    return new UniqueWordsResponse(openingsUniqueWords);
  }

  @Get('/most-popular-openings-character')
  async findMostPopularOpeningsCharacter() {
    const findMostPopularOpeningsCharacter =
      await this.filmsService.findMostPopularOpeningsCharacter();

    return findMostPopularOpeningsCharacter;
  }

  @Get()
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'title', required: false })
  @ApiOkCollectionResponse(FilmResponse, { description: 'Returns all films' })
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

    return new CollectionResponse(
      collection.count,
      collection.page,
      collection.numberPages,
      collection.data.map(this.mapDomainToResponse.bind(this)),
    );
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Returns one film with specified id',
    type: FilmResponse,
  })
  @ApiNotFoundResponse({ description: 'Film with specified id was not found' })
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
    return new FilmResponse(
      film.title,
      film.episodeId,
      film.opening,
      film.director,
      film.producer,
      film.releasedAt,
      film.planetsIds.map((id) => `${this.APP_URL}/planets/${id}`),
      film.starshipsIds.map((id) => `${this.APP_URL}/starships/${id}`),
      film.vehiclesIds.map((id) => `${this.APP_URL}/vehicles/${id}`),
      film.speciesIds.map((id) => `${this.APP_URL}/species/${id}`),
      film.createdAt,
      film.editedAt,
    );
  }
}
