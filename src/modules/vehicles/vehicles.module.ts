import { Module } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { VEHICLES_REPOSITORY } from './vehicles.repository';
import { SwapiVehiclesRepository } from './impl/swapi.vehicles.repository';
import { HttpModule } from '@nestjs/axios';
import { VehiclesController } from './rest/vehicles.controller';

@Module({
  imports: [HttpModule],
  controllers: [VehiclesController],
  providers: [
    VehiclesService,
    {
      provide: VEHICLES_REPOSITORY,
      useClass: SwapiVehiclesRepository,
    },
  ],
})
export class VehiclesModule {}
