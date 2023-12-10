import { SwapiCollectionResponse } from '../../../common/infra/swapi.collection.response';

export interface SwapiVehicleResponse {
  name: string;
  model: string;
  class: string;
  manufacturer: string;
  length: string;
  cost_in_credits: string;
  crew: string;
  passengers: string;
  cargo_capacity: string;
  consumables: string;
  films: string[];
  createdAt: string;
  editedAt: string;
}

export type SwapiVehiclesReponse =
  SwapiCollectionResponse<SwapiVehicleResponse>;
