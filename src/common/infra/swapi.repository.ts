import { ConfigService } from '@nestjs/config';
import { SearchCriteria } from 'common/search-criteria';
import { URL } from 'node:url';
export abstract class SwapiRepository {
  protected readonly URL: string;

  constructor(configService: ConfigService, endpoint: string) {
    this.URL = `${configService.getOrThrow('SWAPI_URL')}/${endpoint}/`;
  }

  protected extractIdsFromUrls(urls: string[]): number[] {
    return urls.map((u) => {
      const match = u.match(/(\d+)\/$/);

      return match && match[1] ? Number(match[1]) : 0;
    });
  }

  protected buildUrlForSearchCriteria(criteria: SearchCriteria) {
    const { page, ...otherCriteria } = criteria;

    const url = new URL(`${this.URL}?page=${page}`);

    const criteriaString = Object.values(otherCriteria)
      .filter((v) => !!v)
      .join(',');

    url.searchParams.append('search', criteriaString);

    return url.href;
  }
}
