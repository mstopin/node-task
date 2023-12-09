import { Injectable } from '@nestjs/common';
import { Film } from './film';
import { FilmsRepository } from './films.repository';

@Injectable()
export class FilmsService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async findOneById(id: number): Promise<Film | null> {
    return await this.filmsRepository.findOneById(id);
  }

  async find(): Promise<Film[]> {
    return await this.filmsRepository.find();
  }
}
