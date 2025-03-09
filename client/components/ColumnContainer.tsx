import { Item } from "@/types/types"
import { Button } from "./ui/button"
import { PlusIcon, Trash } from "lucide-react"
import TaskCard from "./TaskCard"
import { SortableContext, useSortable } from "@dnd-kit/sortable"
import { useMemo } from "react"
import { CSS } from '@dnd-kit/utilities';

interface Props {
    column: string
    index: number
    tasks: Item[];
    createTask: (task: any) => void;
}
function ColumnContainer(props: Props) {
    const { column, tasks } = props

    const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
        id: column,
        data: {
            type: "Column",
            column
        }
    })
    const style = {
        transition,
        transform: CSS.Transform.toString(transform)
    }

    const taskIds = useMemo(() => {
        return tasks.map(task => task.id)
    }, [tasks])
    return (
        <div
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            style={style}
            className="text-white
        bg-[rgb(50,49,57)]
        w-full
        rounded-md
        flex
        flex-col">
            <div
                className="bg-black
            text-md
            h-[60px]
            cursor-grab
            rounded-md
            rounded-b-none
            p-3
            font-bold
            border-[rgb(50,49,57)]
            border-4
            flex
            items-center
            justify-between">
                <div className="flex gap-2">
                    {column}
                </div>

            </div>
            <div className="flex flex-col flex-grow p-2">
                <SortableContext items={taskIds}>
                    {tasks.map((t, i) => {
                        return <TaskCard t={t} key={i}></TaskCard>

                    })}
                </SortableContext>
            </div>
            <Button className="cursor-pointer bg-transparent hover:bg-gray-800">
                <PlusIcon />
                Add Task</Button>
        </div>
    )
}

export default ColumnContainer