import { UniqueIdentifier } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import React, { useState } from 'react';
import { CSS } from '@dnd-kit/utilities';
import clsx from 'clsx';
import { Item } from '@/types/types';
import { Edit, Trash } from 'lucide-react';
import { useDutyApi } from '@/api/duty/useDutyApi';
import { AlertDialogDemo } from '../../Alert';
import Modal from '../Modal';
import Input from '../Input/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../../ui/select';
import { Button } from '../Button';

type ItemsType = {
  // id: UniqueIdentifier;
  // title: string;
  item: Item
  canDelete: boolean
  onDelete?: (id: number) => void
  onUpdate?: (id: number, body: any) => void
};

const Items = ({ item, canDelete, onDelete, onUpdate }: ItemsType) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.id,
    data: {
      type: 'item',
      realId: item.realId,
    },
  });

  const [itemName, setItemName] = useState(item.title);
  const [itemDescriotion, setItemDescription] = useState(item.description);
  const [itemPriority, setItemPriority] = useState(item.priority);
  const [showEditItemModal, setEditItemModal] = useState(false);

  return (
    <div className='w-full'>

      <div
        ref={setNodeRef}
        {...attributes}
        style={{
          transition,
          transform: CSS.Translate.toString(transform),
        }}
        className={clsx(
          'px-2 py-4 bg-white shadow-md rounded-xl w-full border border-transparent hover:border-gray-200 cursor-pointer',
          isDragging && 'opacity-50',
        )}
      >
        <Modal showModal={showEditItemModal} setShowModal={setEditItemModal}>
          <div className="flex flex-col w-full items-start gap-y-4">
            <h1 className="text-gray-800 text-3xl font-bold">Edit Item</h1>
            <Input
              type="text"
              placeholder="Item Title"
              name="itemname"
              value={itemName}
              onChange={(e: any) => setItemName(e.target.value)}
            />
            <Input
              type="text"
              placeholder="Item Description"
              name="itemdesc"
              value={itemDescriotion}
              onChange={(e: any) => setItemDescription(e.target.value)}
            />
            <div className='flex justify-between w-full'>
              <Select onValueChange={(val: any) => { setItemPriority(val) }}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={itemPriority} />
                </SelectTrigger>
                <SelectContent className='bg-white'>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={() => {
              onUpdate!(item.realId as number, {
                title: itemName,
                priority: itemPriority,
                description: itemDescriotion
              })
              setItemName("")
              setItemDescription("")
              setItemPriority("")
              setEditItemModal(false)
            }}>Edit Item</Button>
          </div>
        </Modal>
        <div className="flex items-center justify-between">
          <div>
            <p className='text-xl font-bold'>
              {item.title}
            </p>
            <p className='text-sm text-gray-500 mb-10'>
              {item.description || "No description Found"}
            </p>
            <div className={`py-1 w-50 rounded-r-full rounded-l-full ${item.priority === "MEDIUM" ? "bg-blue-500" : item.priority === "LOW" ? "bg-yellow-300" : "bg-red-500"} `}></div>
          </div>

          <div className='flex flex-col justify-between h-full gap-6'>
            <div className='flex items-start justify-evenly'>
              {canDelete && <AlertDialogDemo
                onAccept={async () => {
                  onDelete!(item.realId as number)
                }}
                title={"Are you sure you want to delete it?"}
                description={"Deleting " + item.title}
                showButtonValue={
                  <Trash className='text-red-500 hover:text-xl' size={20} />
                }
              />}

              <button onClick={() => { setEditItemModal(true) }}>
                <Edit className='text-green-500 hover:text-xl' size={20} />
              </button>
            </div>
            <button
              className="border p-2 text-xs rounded-xl shadow-lg hover:shadow-xl"
              {...listeners}
            >
              Drag Handle
            </button>


          </div>

        </div>
      </div></div>
  );
};

export default Items;