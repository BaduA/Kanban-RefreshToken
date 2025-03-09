import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateDutyDTOService } from '../dto/create.duty.dto';
import { DutyService } from '../duty.service';
import { Role } from '@prisma/client';
import { UpdateBodyDTO } from '../dto/update.duty.dto';
import { Roles } from 'src/decorators/role.decorator';

@Controller('tasks/admin')
export class DutyAdminController {
  constructor(private dutyService: DutyService) {}
  @Post()
  @Roles(Role.ADMIN)
  async createDuty(@Req() req, @Body() dto: CreateDutyDTOService) {
    return await this.dutyService.createDuty(dto);
  }
  @Delete(':id')
  @Roles(Role.ADMIN)
  async deleteDuty(@Param('id') id: number) {
    return await this.dutyService.deleteDuty(id);
  }
  @Patch(':id')
  @Roles(Role.ADMIN)
  async updateDuty(@Param('id') id: number, @Body() dto: UpdateBodyDTO) {
    return await this.dutyService.updateDuty(id, dto);
  }
}
