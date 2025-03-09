import { Module } from '@nestjs/common';
import { DutyController } from './controllers/duty.controller';
import { DutyService } from './duty.service';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [PrismaModule, UsersModule],
  controllers: [DutyController],
  providers: [DutyService],
})
export class DutyModule {}
