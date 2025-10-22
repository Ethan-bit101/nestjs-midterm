import { Module } from '@nestjs/common';
import { PositionsService } from './positions.service';
import { PositionsController } from './positions.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
    imports: [DatabaseModule],
    controllers: [PositionsController], //  imports PositionsController
    providers: [PositionsService], // imports PositionController
    exports: [PositionsService], // imports PositionsService
})
export class PositionsModule {}
