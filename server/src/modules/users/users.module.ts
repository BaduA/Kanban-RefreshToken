import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './controllers/users.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersAdminController } from './controllers/users.admin.controller';

@Module({
  imports: [PrismaModule],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController, UsersAdminController],
})
export class UsersModule {}
