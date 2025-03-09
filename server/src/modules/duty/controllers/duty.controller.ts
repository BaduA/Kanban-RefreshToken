import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  CreateDutyDTOController,
  CreateDutyDTOService,
  CreateDutyDTOUser,
} from '../dto/create.duty.dto';
import { DutyService } from '../duty.service';
import {
  UpdateBodyDTO,
  UpdateBodyModDTOController,
} from '../dto/update.duty.dto';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from '@prisma/client';
import { UsersService } from 'src/modules/users/users.service';

@Controller('tasks')
export class DutyController {
  constructor(
    private dutyService: DutyService,
    private userService: UsersService,
  ) {}
  @Post()
  async createDuty(@Req() req, @Body() dto: CreateDutyDTOUser) {
    var ctdto: CreateDutyDTOService = { ...dto, userId: req.user.userId };
    return await this.dutyService.createDuty(ctdto as CreateDutyDTOService);
  }
  @Delete(':id')
  async deleteDuty(@Req() req, @Param('id') id: number) {
    var duty = await this.dutyService.getDuty(id);
    if (req.user!.userId !== duty?.userId) throw new BadRequestException();
    return await this.dutyService.deleteDuty(id);
  }
  @Patch(':id')
  async updateDuty(
    @Req() req,
    @Param('id') id: number,
    @Body() dto: UpdateBodyDTO,
  ) {
    var duty = await this.dutyService.getDuty(id);
    if (req.user!.userId !== duty?.userId) throw new BadRequestException();
    console.log(duty?.title);
    return await this.dutyService.updateDuty(id, dto);
  }
  @Get()
  async getTasks(@Req() req) {
    return await this.dutyService.getUsersDuties(req.user.id);
  }
  @Get('user/:id')
  async getTasksUser(@Param('id') id: string) {
    return await this.dutyService.getUsersDuties(id);
  }

  @Get(':id')
  async getTask(@Param('id') id: number) {
    return await this.dutyService.getDuty(id);
  }
  @Get('username/:username')
  @Roles(Role.ADMIN, Role.MODERATOR)
  async getTasksUsername(@Param('username') username: string) {
    return await this.dutyService.getUsersDutiesUsername(username);
  }
  @Patch('forUser/:id')
  @Roles(Role.MODERATOR, Role.ADMIN)
  async updateUserDuty(
    @Param('id') id: number,
    @Body() dto: UpdateBodyModDTOController,
  ) {
    var user = await this.userService.findOne(dto.username);
    if (!user) throw new UnauthorizedException();
    delete (dto as any)['username'];
    return await this.dutyService.updateDuty(id, { ...dto, userId: user.id });
  }
  @Post('forUser')
  @Roles(Role.ADMIN)
  async createUserDuty(@Req() req, @Body() dto: CreateDutyDTOController) {
    var user = await this.userService.findOne(dto.username);
    if (!user) throw new UnauthorizedException();
    delete (dto as any)['username'];
    return await this.dutyService.createDuty({ ...dto, userId: user.id });
  }
  @Delete('forUser/:id')
  @Roles(Role.ADMIN)
  async deleteUserDuty(
    @Param('id') id: number,
  ) {
    return await this.dutyService.deleteDuty(id);
  }
}
