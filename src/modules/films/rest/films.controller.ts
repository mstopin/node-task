import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { FilmsService } from '../films.service';

@Controller('/films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Get()
  async find() {
    return await this.filmsService.find();
  }

  @Get(':id')
  async findOneById(@Param('id', ParseIntPipe) id: number) {
    return await this.filmsService.findOneById(id);
  }
}
