import { useAuthContext } from "@/api/auth/useAuthContext"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"



export function TableDemo({ data, onChangeRole }: any) {
    const { role, username } = useAuthContext()
    return (
        <div className="w-[75%]">
            <div className="rounded-md border w-[100%] text-white dark p-1">
                <Table>
                    {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[25%]">Role</TableHead>
                            <TableHead className="w-[25%]">Username</TableHead>
                            <TableHead className="w-[25%]">Member Since</TableHead>
                            <TableHead className="w-[25%]">Tasks</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((d: any) => (
                            <TableRow key={d.id}>
                                <TableCell className="font-medium">
                                    {role === "ADMIN" && d.username !== username ? <Select onValueChange={(val) => { onChangeRole(d.id, val) }}>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder={d.role} />
                                        </SelectTrigger>
                                        <SelectContent className='bg-white'>
                                            <SelectItem value="ADMIN">Admin</SelectItem>
                                            <SelectItem value="MODERATOR">Mod</SelectItem>
                                            <SelectItem value="USER">User</SelectItem>
                                        </SelectContent>
                                    </Select> : <div className="py-1 pl-5"> {d.role}</div>}

                                </TableCell>
                                <TableCell>{d.username}</TableCell>
                                <TableCell>{(new Date(d.createdAt)).toDateString()}</TableCell>
                                <TableCell className="">{d.role === "USER" && <Link href={"/" + role?.toLowerCase() + "/tasks/" + d.username} className="text-blue-400">Click to see tasks</Link>}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>

                </Table>
            </div></div>
    )
}
