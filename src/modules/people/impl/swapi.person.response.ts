import { SwapiCollectionResponse } from '../../../common/infra/swapi.collection.response';

export interface SwapiPersonResponse {
  name: string;
}

export type SwapiPeopleReponse = SwapiCollectionResponse<SwapiPersonResponse>;
