"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "../ui/button"
import { MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { ComboboxDemo } from "../ui/Combobox"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  username:string
  createdAt:Date
  role:string
}
const frameworks = [
  {
    value: "ADMIN",
    label: "Admin",
  },

  {
    value: "USER",
    label: "User",
  },
  {
    value: "MODERATOR",
    label: "Mod",
  },
]

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "role",
    header: "Role",
    cell:({row})=>{
      return <ComboboxDemo currentValue={row.original.role} frameworks={frameworks}/>
    }
  },
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "createdAt",
    header: "CreatedAt",
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
            >
              See user's tasks
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
