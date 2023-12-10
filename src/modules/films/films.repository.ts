import { Repository } from '../../common/repository';
import { Film } from './film';

export const FILMS_REPOSITORY = Symbol.for('FilmsRepository');

export interface FilmsRepository extends Repository<Film> {}
