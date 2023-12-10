import {
  Controller,
  DefaultValuePipe,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { VehiclesService } from '../vehicles.service';
import { VehicleResponse } from './vehicles.response';
import { CollectionResponse } from 'common/rest/collection.response';
import { Vehicle } from '../vehicle';
import { ConfigService } from '@nestjs/config';

@Controller('/vehicles')
export class VehiclesController {
  private readonly APP_URL: string;

  constructor(
    private readonly vehiclesService: VehiclesService,
    configService: ConfigService,
  ) {
    this.APP_URL = configService.getOrThrow('APP_URL');
  }

  @Get()
  async find(
    @Query(
      'page',
      new ParseIntPipe({ optional: true }),
      new DefaultValuePipe(1),
    )
    page: number,
    @Query('name')
    name?: string,
    @Query('model')
    model?: string,
  ): Promise<CollectionResponse<VehicleResponse>> {
    const collection = await this.vehiclesService.find({
      page,
      name,
      model,
    });

    return {
      count: collection.count,
      page: collection.page,
      numberPages: collection.numberPages,
      data: collection.data.map(this.mapDomainToResponse.bind(this)),
    };
  }

  @Get(':id')
  async findOneById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<VehicleResponse> {
    const vehicle = await this.vehiclesService.findOneById(id);

    if (!vehicle) {
      throw new NotFoundException();
    }

    return this.mapDomainToResponse(vehicle);
  }

  private mapDomainToResponse(vehicle: Vehicle): VehicleResponse {
    return {
      name: vehicle.name,
      model: vehicle.model,
      class: vehicle.class,
      manufacturer: vehicle.manufacturer,
      length: vehicle.length,
      cost: vehicle.cost,
      crew: vehicle.crew,
      passengers: vehicle.passengers,
      cargoCapacity: vehicle.cargoCapacity,
      consumables: vehicle.consumables,
      films: vehicle.filmsIds.map((id) => `${this.APP_URL}/films/${id}`),
      createdAt: vehicle.createdAt,
      editedAt: vehicle.editedAt,
    };
  }
}
