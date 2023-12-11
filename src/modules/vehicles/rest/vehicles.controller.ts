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
import { CollectionResponse } from '../../../common/rest/collection.response';
import { Vehicle } from '../vehicle';
import { ConfigService } from '@nestjs/config';
import { ApiNotFoundResponse, ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import { ApiOkCollectionResponse } from '../../../common/rest/api-ok-collection.response';

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
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'name', required: false })
  @ApiQuery({ name: 'model', required: false })
  @ApiOkCollectionResponse(VehicleResponse, {
    description: 'Returns all vehicles',
  })
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
  @ApiOkResponse({
    description: 'Returns one vehicle with specified id',
    type: VehicleResponse,
  })
  @ApiNotFoundResponse({
    description: 'Vehicle with specified id was not found',
  })
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
    return new VehicleResponse(
      vehicle.name,
      vehicle.model,
      vehicle.class,
      vehicle.manufacturer,
      vehicle.length,
      vehicle.cost,
      vehicle.crew,
      vehicle.passengers,
      vehicle.cargoCapacity,
      vehicle.consumables,
      vehicle.filmsIds.map((id) => `${this.APP_URL}/films/${id}`),
      vehicle.createdAt,
      vehicle.editedAt,
    );
  }
}
