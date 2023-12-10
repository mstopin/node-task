export interface SwapiFilmResponse {
  title: string;
  episode_id: number;
  opening_crawl: string;
  director: string;
  producer: string;
  release_date: string;
  species: string[];
  starships: string[];
  vehicles: string[];
  characters: string[];
  planets: string[];
  created: string;
  edited: string;
}

export interface SwapiFilmsReponse {
  count: number;
  next: string;
  previous: string;
  results: SwapiFilmResponse[];
}
