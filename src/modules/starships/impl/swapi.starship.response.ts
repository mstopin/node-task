import { SwapiCollectionResponse } from '../../../common/infra/swapi.collection.response';

export interface SwapiStarshipResponse {
  name: string;
  model: string;
  starship_class: string;
  manufacturer: string;
  cost_in_credits: string;
  length: string;
  crew: string;
  passengers: string;
  films: string[];
  created: string;
  edited: string;
}

export type SwapiStarshipsReponse =
  SwapiCollectionResponse<SwapiStarshipResponse>;
