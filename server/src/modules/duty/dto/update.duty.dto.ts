import { Priority, Status } from '@prisma/client';
import { IsEmpty, IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

// enum Priority {
//   LOW,
//   MEDIUM,
//   HIGH,
// }
// enum Status {
//   BACKLOG,
//   TODO,
//   INPROGRESS,
//   DONE,
// }

export class UpdateBodyDTO {
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  orderInColumn: number;
}
export class UpdateBodyModDTOService {
  title: string;
  description: string;
  @IsNotEmpty()
  userId: string;
  priority: Priority;
  status: Status;
  orderInColumn: number;
}
export class UpdateBodyModDTOController {
  title: string;
  description: string;
  @IsNotEmpty()
  username: string;
  priority: Priority;
  status: Status;
  orderInColumn: number;
}
