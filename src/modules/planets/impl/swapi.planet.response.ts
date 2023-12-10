import { SwapiCollectionResponse } from '../../../common/infra/swapi.collection.response';

export interface SwapiPlanetResponse {
  name: string;
  diameter: string;
  rotation_period: string;
  orbiatal_period: string;
  gravity: string;
  population: string;
  films: string[];
  createdAt: string;
  editedAt: string;
}

export type SwapiPlanetsResponse = SwapiCollectionResponse<SwapiPlanetResponse>;
