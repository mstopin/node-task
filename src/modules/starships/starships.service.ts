import { Inject, Injectable } from '@nestjs/common';
import { Collection } from '../../common/collection';
import {
  STARSHIPS_REPOSITORY,
  StarshipsRepository,
} from './starships.repository';
import { Starship } from './starship';
import { StarshipsSearchCriteria } from './starships.search-criteria';

@Injectable()
export class StarshipsService {
  constructor(
    @Inject(STARSHIPS_REPOSITORY)
    private readonly starshipsRepository: StarshipsRepository,
  ) {}

  async find(
    searchCriteria: StarshipsSearchCriteria,
  ): Promise<Collection<Starship>> {
    return await this.starshipsRepository.find(searchCriteria);
  }

  async findOneById(id: number): Promise<Starship | null> {
    return await this.starshipsRepository.findOneById(id);
  }
}
