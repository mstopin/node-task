import { Inject, Injectable } from '@nestjs/common';
import { Collection } from '../../common/collection';
import { SpeciesSearchCriteria } from './species.search-criteria';
import { SPECIES_REPOSITORY, SpeciesRepository } from './species.repository';
import { Species } from './species';

@Injectable()
export class SpeciesService {
  constructor(
    @Inject(SPECIES_REPOSITORY)
    private readonly speciesRepository: SpeciesRepository,
  ) {}

  async find(
    searchCriteria: SpeciesSearchCriteria,
  ): Promise<Collection<Species>> {
    return await this.speciesRepository.find(searchCriteria);
  }

  async findOneById(id: number): Promise<Species | null> {
    return await this.speciesRepository.findOneById(id);
  }
}
