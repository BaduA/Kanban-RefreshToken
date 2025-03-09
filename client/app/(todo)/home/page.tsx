"use client"
import { useDutyApi } from '@/api/duty/useDutyApi'
import KanbanBoard from '@/components/KanbanBoard';
import { Item } from '@/types/types';
import React, { useEffect, useState } from 'react'



function Home() {
    // const [data, setData] = useState(null)
    const [isLoading, setLoading] = useState(true)
    const [refetch, setRefetch] = useState(0)
    const { findAll, createTask, deleteTask, updateTask } = useDutyApi()
    const [items, setItems] = useState<Item[]>([
    ]);
    const onAddItem = async (body: Item) => {
        var res = await createTask(body)
        setLoading(true)
        setRefetch(refetch + 1)
    };
    const onDeleteItem = async (id: number) => {
        var res = await deleteTask(id)
        setLoading(true)
        setRefetch(refetch + 1)
    };
    const onUpdateItem = async (id: number, body: any) => {
        var res = await updateTask(id, body)
        if (body.orderInColumn === undefined)
            setLoading(true)
        setRefetch(refetch + 1)
    };
    useEffect(() => {
        findAll()
            // .then((res) => res.json())
            .then((data) => {
                setItems(data)
                setLoading(false)
            })
    }, [refetch])

    if (isLoading) return <div className='flex w-full h-full justify-center items-center'>LOADING</div>

    return (
        <div className=''>
            <div>KANBAN BOARD</div>
            <KanbanBoard canEdit={true} canAdd={true} updateItemFunc={onUpdateItem} deleteItemFunc={onDeleteItem} addItemFunc={onAddItem} canDelete={true} items={items} />
        </div>
    )
}

export default Home