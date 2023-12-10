import { Inject, Injectable } from '@nestjs/common';
import { Film } from './film';
import { FILMS_REPOSITORY, FilmsRepository } from './films.repository';
import { FilmsSearchCriteria } from './films.search-criteria';

@Injectable()
export class FilmsService {
  constructor(
    @Inject(FILMS_REPOSITORY) private readonly filmsRepository: FilmsRepository,
  ) {}

  async find(searchCriteria: FilmsSearchCriteria): Promise<Film[]> {
    return await this.filmsRepository.find(searchCriteria);
  }

  async findOneById(id: number): Promise<Film | null> {
    return await this.filmsRepository.findOneById(id);
  }
}
