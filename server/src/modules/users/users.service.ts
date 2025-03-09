import { Injectable } from '@nestjs/common';
import { ChangeRole } from './dto/changeRole.dto';
import { PrismaService } from '../prisma/prisma.service';

// This should be a real class/interface representing a user entity
export type User = any;

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(username: string): Promise<User | undefined> {
    return await this.prisma.user.findFirst({ where: { username } });
  }
  async findById(id: string): Promise<User | undefined> {
    return await this.prisma.user.findFirst({ where: { id } });
  }
  async findMany() {
    return await this.prisma.user.findMany({
      orderBy: {
        role: 'desc',
      },
    });
  }
  async changeRole(dto: ChangeRole) {
    return await this.prisma.user.update({
      where: { id: dto.id },
      data: { role: dto.role },
    });
  }
}
