import { Module} from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { PositionsModule } from './positions/positions.module'; // imports PositionsModule from the positions module

@Module({
    imports: [DatabaseModule, UsersModule, AuthModule, PositionsModule,], // organizes application into modules
})
export class AppModule {}
