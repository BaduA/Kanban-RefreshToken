import React from 'react'
import { Card, CardContent, CardFooter } from './ui/card';
import { Trash } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function TaskCard({ t }: { t: any }) {
    let color;
    if (t.priority === "MEDIUM") color = "text-blue-500"
    else if (t.priority === "LOW") color = "text-gray-500"
    else if (t.priority === "HIGH") color = "text-red-500"

    const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
        id: t.id, data: {
            type: "Task",
            t
        }
    })
    const style = {
        transition,
        transform: CSS.Transform.toString(transform)
    }
    // if(isDragging) return <div></div>
    return <Card
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="w-full p-2 border-none mb-2 shadow-xl border bg-[rgb(52,50,66)]">
        {/* <CardHeader>
            Priority: {t.priority.toWellFormed()}
        </CardHeader> */}
        <CardContent>
            <div className="flex justify-between">
                <p className="text-xl">{t.title}</p>
                <button className="cursor-pointer">
                    <Trash />

                </button>
            </div>

            <p className="text-sm text-gray-600 ">{t.description || "No description found"}</p>
        </CardContent>
        <CardFooter className={color}>
            Priority: {t.priority}
        </CardFooter>
    </Card>
}

export default TaskCard