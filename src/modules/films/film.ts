import { FilmOpening } from './film-opening';

export interface Film {
  title: string;
  episodeId: number;
  opening: FilmOpening;
  director: string;
  producer: string;
  releasedAt: string;
  planetsIds: number[];
  starshipsIds: number[];
  vehiclesIds: number[];
  speciesIds: number[];
  createdAt: string;
  editedAt: string;
}
