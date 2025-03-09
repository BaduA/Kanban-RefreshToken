import { Priority, Status } from '@prisma/client';
import { IsEmpty, IsNotEmpty, IsUUID } from 'class-validator';
import { UUID } from 'crypto';

export class CreateDutyDTOService {
  @IsNotEmpty()
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  @IsUUID()
  @IsNotEmpty()
  userId: UUID;
}
export class CreateDutyDTOController {
  @IsNotEmpty()
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  @IsNotEmpty()
  username: string;
}
export class CreateDutyDTOUser {
  @IsNotEmpty()
  title: string;
  description: string;
  priority: Priority;
  status: Status;
}
