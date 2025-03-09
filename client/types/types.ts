import { UniqueIdentifier } from "@dnd-kit/core";
import { v4 as uuidv4 } from "uuid";

export type Column = {
  title: String;
};

export type Item = {
  id: UniqueIdentifier;
  realId?: UniqueIdentifier;
  priority?: string;
  status?: string;
  title: string;
  description?: string;
  orderInColumn: number;
};

export const columns = [
  {
    id: `container-${uuidv4()}`,
    name: "Backlog",
    value: "BACKLOG",
  },
  {
    id: `container-${uuidv4()}`,
    name: "In Progress",
    value: "INPROGRESS",
  },
  {
    id: `container-${uuidv4()}`,
    name: "To Do",
    value: "TODO",
  },
  {
    id: `container-${uuidv4()}`,
    name: "Done",
    value: "DONE",
  },
];
