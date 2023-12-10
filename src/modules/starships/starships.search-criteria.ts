import { SearchCriteria } from '../../common/search-criteria';

export interface StarshipsSearchCriteria extends SearchCriteria {
  name?: string;
  model?: string;
}
