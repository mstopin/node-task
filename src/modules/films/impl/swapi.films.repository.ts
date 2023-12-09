import { HttpService } from '@nestjs/axios';

import { Film } from '../film';
import { FilmsRepository } from '../films.repository';

export class SwapiFilmsRepository extends FilmsRepository {

  constructor(private readonly httpService: HttpService) {
    super();
  }

  async findOneById(id: number): Promise<Film | null> {
    return this.
  }

  async find(): Promise<Film[]> {
    throw new Error('Method not implemented.');
  }
}
