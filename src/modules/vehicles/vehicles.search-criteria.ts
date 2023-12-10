import { SearchCriteria } from '../../common/search-criteria';

export interface VehiclesSearchCriteria extends SearchCriteria {
  name?: string;
  model?: string;
}
