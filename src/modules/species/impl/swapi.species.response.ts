import { SwapiCollectionResponse } from '../../../common/infra/swapi.collection.response';

export interface SwapiSpeciesResponse {
  name: string;
  classification: string;
  designation: string;
  average_height: string;
  average_lifespan: string;
  language: string;
  homeworld: string | null;
  films: string[];
  created: string;
  edited: string;
}

export type SwapiMultipleSpeciesResponse =
  SwapiCollectionResponse<SwapiSpeciesResponse>;
