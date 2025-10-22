import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
    imports: [DatabaseModule],
    controllers: [UsersController], // ✅ matches the class name
    providers: [UsersService],
    exports: [UsersService],
})
export class UsersModule {}
