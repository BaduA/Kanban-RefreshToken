"use client"
import { useParams, usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import KanbanBoard from '@/components/KanbanBoard';
import { useDutyApi } from '@/api/duty/useDutyApi';
import { Item } from '@/types/types';


function UserTasks() {
  const params = useParams<{ username: string }>()
  const [isLoading, setLoading] = useState(true)
  const [refetch, setRefetch] = useState(0)
  const { findByUsername, createUserTask, deleteUserTask, updateUserTask } = useDutyApi()
  const [items, setItems] = useState<Item[]>([
  ]);
  const onAddItem = async (body: Item) => {
    var res = await createUserTask({ ...body, username: params.username })
    setLoading(true)
    setRefetch(refetch + 1)
  };
  const onDeleteItem = async (id: number) => {
    var res = await deleteUserTask(id)
    setLoading(true)
    setRefetch(refetch + 1)
  };
  const onUpdateItem = async (id: number, body: any) => {
    var res = await updateUserTask(id, { ...body, username: params.username })
    if (body.orderInColumn === undefined)
      setLoading(true)
    setRefetch(refetch + 1)
  };
  useEffect(() => {
    findByUsername(params.username)
      // .then((res) => res.json())
      .then((data) => {
        setItems(data)
        setLoading(false)
      })
  }, [refetch])

  if (isLoading) return <div className='flex w-full h-full justify-center items-center'>LOADING</div>

  return (
    <div>
      <KanbanBoard canEdit={true} canAdd={true} canDelete={true} updateItemFunc={onUpdateItem} deleteItemFunc={onDeleteItem} addItemFunc={onAddItem} items={items} />
    </div>
  )
}

export default UserTasks