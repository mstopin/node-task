import { Repository } from '../../common/repository';
import { Film } from './film';
import { FilmsSearchCriteria } from './films.search-criteria';

export const FILMS_REPOSITORY = Symbol.for('FilmsRepository');

export interface FilmsRepository extends Repository<Film, FilmsSearchCriteria> {
  findAll(): Promise<Film[]>;
}
