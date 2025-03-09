import { Body, Injectable } from '@nestjs/common';
import { CreateDutyDTOService, CreateDutyDTOUser } from './dto/create.duty.dto';
import { UpdateBodyDTO, UpdateBodyModDTOService } from './dto/update.duty.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DutyService {
  constructor(private prisma: PrismaService) {}

  async createDuty(dto: CreateDutyDTOService) {
    console.log(dto)
    var count = (
      await this.prisma.duty.findMany({ where: { status: dto.status } })
    ).length;
    return await this.prisma.duty.create({
      data: { ...dto, orderInColumn: count },
    });
  }
  async deleteDuty(id: number) {
    return await this.prisma.duty.delete({ where: { id } });
  }
  async updateDuty(id: number, dto: UpdateBodyModDTOService | UpdateBodyDTO) {
    return await this.prisma.duty.update({
      where: { id },
      data: dto,
    });
  }
  async getUsersDuties(userId: string) {
    return await this.prisma.duty.findMany({
      where: { userId },
      orderBy: {
        orderInColumn: 'asc',
      },
    });
  }
  async getUsersDutiesUsername(username: string) {
    return await this.prisma.duty.findMany({
      where: {
        assignedTo: {
          username,
        },
      },
      orderBy: {
        orderInColumn: 'asc',
      },
    });
  }
  async getDuty(id: number) {
    return await this.prisma.duty.findFirst({ where: { id } });
  }
}
