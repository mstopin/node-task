import { Repository } from '../../common/repository';
import { Film } from './film';

export abstract class FilmsRepository extends Repository<Film> {}
