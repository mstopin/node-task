export interface Film {
  id: number;
  title: string;
  episodeId: number;
  openingCrawl: string;
  director: string;
  producer: string;
  releasedAt: string;
  charactersIds: number[];
  planetsIds: number[];
  starshipsIds: number[];
  vehiclesIds: number[];
  speciesIds: number[];
  createdAt: string;
  editedAt: string;
}
