import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { UsersService } from '../users.service';
import { Role } from '@prisma/client';
import { Roles } from 'src/decorators/role.decorator';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async getUsers() {
    return await this.usersService.findMany();
  }
  @Patch(':id/:role')
  @Roles(Role.ADMIN)
  async changeRole(@Param('id') id: string, @Param('role') role: Role) {
    return await this.usersService.changeRole({ id, role });
  }
}
