import {
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { FilmsService } from '../films.service';

@Controller('/films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Get()
  async find(
    @Query(
      'page',
      new ParseIntPipe({ optional: true }),
      new DefaultValuePipe(1),
    )
    page: number,
    @Query('title')
    title?: string,
  ) {
    return await this.filmsService.find({
      page,
      title,
    });
  }

  @Get(':id')
  async findOneById(@Param('id', ParseIntPipe) id: number) {
    return await this.filmsService.findOneById(id);
  }
}
