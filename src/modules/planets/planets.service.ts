import { Inject, Injectable } from '@nestjs/common';
import { Collection } from '../../common/collection';
import { PLANETS_REPOSITORY, PlanetsRepository } from './planets.repository';
import { PlanetsSearchCriteria } from './planets.search-criteria';
import { Planet } from './planet';

@Injectable()
export class PlanetsService {
  constructor(
    @Inject(PLANETS_REPOSITORY)
    private readonly planetsRepository: PlanetsRepository,
  ) {}

  async find(
    searchCriteria: PlanetsSearchCriteria,
  ): Promise<Collection<Planet>> {
    return await this.planetsRepository.find(searchCriteria);
  }

  async findOneById(id: number): Promise<Planet | null> {
    return await this.planetsRepository.findOneById(id);
  }
}
