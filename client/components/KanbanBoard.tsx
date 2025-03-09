import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

// DnD
import {
    DndContext,
    DragEndEvent,
    DragMoveEvent,
    DragOverlay,
    DragStartEvent,
    KeyboardSensor,
    PointerSensor,
    UniqueIdentifier,
    closestCorners,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    SortableContext,
    arrayMove,
    sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';

// Components
import Container from './DND/Container';
import Items from './DND/Item';
import Modal from './DND/Modal';
import Input from './DND/Input/input';
import { Button } from '@/components/DND/Button';
import { columns, Item } from '@/types/types';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './ui/select';
import { setPriority } from 'os';
import { useDutyApi } from '@/api/duty/useDutyApi';
import { toast } from 'sonner';


type DNDType = {
    id: UniqueIdentifier;
    title: string;
    value: string
    items: Item[];
};

type KanbanProps = {
    canEdit: boolean;
    canDelete: boolean;
    canAdd: boolean;
    addItemFunc: any;
    deleteItemFunc: any;
    updateItemFunc: any;
    items: Item[]
}

export default function Home(props: KanbanProps) {
    const { canEdit, canDelete, canAdd, items, addItemFunc, deleteItemFunc, updateItemFunc } = props
    const returnItems = (items: Item[], status: string) => {
        var newItems: Item[] = []
        items.forEach(element => {
            newItems.push({ ...element, id: `item-${uuidv4()}`, realId: element.id })
        });
        newItems = newItems.filter(it => { return it.status == status })
        return newItems
    };
    const mappedColumns = columns.map((i) => { return { id: i.id, title: i.name, value: i.value, items: returnItems(items, i.value) } })
    const [containers, setContainers] = useState<DNDType[]>(mappedColumns);

    const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
    const [currentContainerId, setCurrentContainerId] =
        useState<UniqueIdentifier>();


    const [itemName, setItemName] = useState('');
    const [itemDescriotion, setItemDescription] = useState('');
    const [itemPriority, setItemPriority] = useState('');
    const [showAddItemModal, setShowAddItemModal] = useState(false);


    const onAddItem = async () => {
        const container = containers.find((item) => item.id === currentContainerId);
        if (!container) return;
        const body = {
            title: itemName,
            description: itemDescriotion,
            status: container.value,
            priority: itemPriority
        }
        addItemFunc(body)
        setItemName('');
        setItemDescription('');
        setItemPriority('');
        setShowAddItemModal(false);
    };
    const onDeleteItem = async (id: number) => {
        deleteItemFunc(id)
    }

    // Find the value of the items
    function findValueOfItems(id: UniqueIdentifier | undefined, type: string) {
        if (type === 'container') {
            return containers.find((item) => item.id === id);
        }
        if (type === 'item') {
            return containers.find((container) =>
                container.items.find((item) => item.id === id),
            );
        }
    }

    // const findItemTitle = (id: UniqueIdentifier | undefined) => {
    //     const container = findValueOfItems(id, 'item');
    //     if (!container) return '';
    //     const item = container.items.find((item) => item.id === id);
    //     if (!item) return '';
    //     return item.title;
    // };
    const findItem = (id: UniqueIdentifier | undefined) => {
        const container = findValueOfItems(id, 'item');
        if (!container) return '';
        const item = container.items.find((item) => item.id === id);
        if (!item) return '';
        return item;
    };
    const findContainerTitle = (id: UniqueIdentifier | undefined) => {
        const container = findValueOfItems(id, 'container');
        if (!container) return '';
        return container.title;
    };
    const findContainerItems = (id: UniqueIdentifier | undefined) => {
        const container = findValueOfItems(id, 'container');
        if (!container) return [];
        return container.items;
    };

    // DND Handlers
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    );

    function handleDragStart(event: DragStartEvent) {
        const { active } = event;
        const { id } = active;
        setActiveId(id);
    }

    const handleDragMove = (event: DragMoveEvent) => {
        const { active, over } = event;

        // Handle Items Sorting
        if (
            active.id.toString().includes('item') &&
            over?.id.toString().includes('item') &&
            active &&
            over &&
            active.id !== over.id
        ) {
            // Find the active container and over container
            const activeContainer = findValueOfItems(active.id, 'item');
            const overContainer = findValueOfItems(over.id, 'item');

            // If the active or over container is not found, return
            if (!activeContainer || !overContainer) return;

            // Find the index of the active and over container
            const activeContainerIndex = containers.findIndex(
                (container) => container.id === activeContainer.id,
            );
            const overContainerIndex = containers.findIndex(
                (container) => container.id === overContainer.id,
            );

            // Find the index of the active and over item
            const activeitemIndex = activeContainer.items.findIndex(
                (item) => item.id === active.id,
            );
            const overitemIndex = overContainer.items.findIndex(
                (item) => item.id === over.id,
            );
            // In the same container
            if (activeContainerIndex === overContainerIndex) {
                let newItems = [...containers];
                updateItemFunc(active.data.current!.realId, { orderInColumn: overitemIndex })
                updateItemFunc(overContainer.items[overitemIndex].realId, { orderInColumn: activeitemIndex })
                newItems[activeContainerIndex].items = arrayMove(
                    newItems[activeContainerIndex].items,
                    activeitemIndex,
                    overitemIndex,
                );
                setContainers(newItems);


            } else {
                // In different containers
                let newItems = [...containers];
                updateItemFunc(active.data.current!.realId, { status: overContainer.value, orderInColumn: overitemIndex })
                for (let i = activeitemIndex + 1; i < activeContainer.items.length; i++) {
                    updateItemFunc((activeContainer.items)[i].realId, { orderInColumn: i - 1 })
                }
                for (let i = overitemIndex; i < overContainer.items.length; i++) {
                    updateItemFunc((overContainer.items)[i].realId, { orderInColumn: i + 1 })
                }
                const [removeditem] = newItems[activeContainerIndex].items.splice(
                    activeitemIndex,
                    1,
                );
                newItems[overContainerIndex].items.splice(
                    overitemIndex,
                    0,
                    removeditem,
                );
                setContainers(newItems);


            }
        }

        // Handling Item Drop Into a Container
        if (
            active.id.toString().includes('item') &&
            over?.id.toString().includes('container') &&
            active &&
            over &&
            active.id !== over.id
        ) {
            // Find the active and over container
            const activeContainer = findValueOfItems(active.id, 'item');
            const overContainer = findValueOfItems(over.id, 'container');

            // If the active or over container is not found, return
            if (!activeContainer || !overContainer) return;

            // Find the index of the active and over container
            const activeContainerIndex = containers.findIndex(
                (container) => container.id === activeContainer.id,
            );
            const overContainerIndex = containers.findIndex(
                (container) => container.id === overContainer.id,
            );

            // Find the index of the active and over item
            const activeitemIndex = activeContainer.items.findIndex(
                (item) => item.id === active.id,
            );

            // Remove the active item from the active container and add it to the over container
            let newItems = [...containers];
            const [removeditem] = newItems[activeContainerIndex].items.splice(
                activeitemIndex,
                1,
            );
            newItems[overContainerIndex].items.push(removeditem);
            setContainers(newItems);
            updateItemFunc(active.data.current!.realId, { status: overContainer.value, orderInColumn: 0 })
        }
    };

    // This is the function that handles the sorting of the containers and items when the user is done dragging.
    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        // Handling item Sorting
        if (
            active.id.toString().includes('item') &&
            over?.id.toString().includes('item') &&
            active &&
            over &&
            active.id !== over.id
        ) {
            // Find the active and over container
            const activeContainer = findValueOfItems(active.id, 'item');
            const overContainer = findValueOfItems(over.id, 'item');

            // If the active or over container is not found, return
            if (!activeContainer || !overContainer) return;
            // Find the index of the active and over container
            const activeContainerIndex = containers.findIndex(
                (container) => container.id === activeContainer.id,
            );
            const overContainerIndex = containers.findIndex(
                (container) => container.id === overContainer.id,
            );
            // Find the index of the active and over item
            const activeItem = findItem(active.id)
            const activeitemIndex = activeContainer.items.findIndex(
                (item) => item.id === active.id,
            );
            const overItem = findItem(over.id)
            const overitemIndex = overContainer.items.findIndex(
                (item) => item.id === over.id,
            );

            // In the same container
            if (activeContainerIndex === overContainerIndex) {
                let newItems = [...containers];
                newItems[activeContainerIndex].items = arrayMove(
                    newItems[activeContainerIndex].items,
                    activeitemIndex,
                    overitemIndex,
                );
                setContainers(newItems);
                updateItemFunc(active.data.current!.realId, { orderInColumn: over.data.current!.orderInColumn })
                updateItemFunc(over.data.current!.realId, { orderInColumn: active.data.current!.orderInColumn })
            } else {
                // In different containers
                let newItems = [...containers];
                const [removeditem] = newItems[activeContainerIndex].items.splice(
                    activeitemIndex,
                    1,
                );
                newItems[overContainerIndex].items.splice(
                    overitemIndex,
                    0,
                    removeditem,
                );
                setContainers(newItems);
                // updateItemFunc(active.data.current!.realId, { orderInColumn: overContainer.value })
            }
        }
        // Handling item dropping into Container
        if (
            active.id.toString().includes('item') &&
            over?.id.toString().includes('container') &&
            active &&
            over &&
            active.id !== over.id
        ) {
            // Find the active and over container
            const activeContainer = findValueOfItems(active.id, 'item');
            const overContainer = findValueOfItems(over.id, 'container');

            // If the active or over container is not found, return
            if (!activeContainer || !overContainer) return;
            // Find the index of the active and over container
            const activeContainerIndex = containers.findIndex(
                (container) => container.id === activeContainer.id,
            );
            const overContainerIndex = containers.findIndex(
                (container) => container.id === overContainer.id,
            );
            // Find the index of the active and over item
            const activeitemIndex = activeContainer.items.findIndex(
                (item) => item.id === active.id,
            );

            let newItems = [...containers];
            const [removeditem] = newItems[activeContainerIndex].items.splice(
                activeitemIndex,
                1,
            );
            newItems[overContainerIndex].items.push(removeditem);
            setContainers(newItems);
            // updateItemFunc(active.data.current!.realId, { status: overContainer.value })
        }
        setActiveId(null);
    }

    return (
        <div className="mx-auto max-w-7xl py-10">

            <Modal showModal={showAddItemModal} setShowModal={setShowAddItemModal}>
                <div className="flex flex-col w-full items-start gap-y-4">
                    <h1 className="text-gray-800 text-3xl font-bold">Add Item</h1>
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
                        <Select onValueChange={(val) => { setItemPriority(val) }}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Priority" />
                            </SelectTrigger>
                            <SelectContent className='bg-white'>
                                <SelectItem value="LOW">Low</SelectItem>
                                <SelectItem value="MEDIUM">Medium</SelectItem>
                                <SelectItem value="HIGH">High</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button onClick={onAddItem}>Add Item</Button>
                </div>
            </Modal>

            <div className="flex items-center justify-between gap-y-2">
                <h1 className="text-gray-300 text-3xl font-bold">Tasks</h1>
            </div>
            <div className="mt-10">
                <div className="grid grid-cols-3 gap-6">
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCorners}
                        onDragStart={handleDragStart}
                        onDragMove={handleDragMove}
                    // onDragEnd={handleDragEnd}
                    >
                        <SortableContext items={containers.map((i) => i.id)}>
                            {containers.map((container) => (
                                <Container
                                    id={container.id}
                                    title={container.title}
                                    key={container.id}
                                    canAddItem = {canAdd}
                                    onAddItem={() => {
                                        setShowAddItemModal(true);
                                        setCurrentContainerId(container.id);
                                    }}
                                >
                                    <SortableContext items={container.items.map((i) => i.id)}>
                                        <div className="flex items-start flex-col gap-y-4">
                                            {container.items.map((i) => (
                                                <Items item={i} key={i.id} onDelete={onDeleteItem} canDelete={canDelete} onUpdate={updateItemFunc} />
                                            ))}
                                        </div>
                                    </SortableContext>
                                </Container>
                            ))}
                        </SortableContext>
                        <DragOverlay adjustScale={false}>
                            {/* Drag Overlay For item Item */}
                            {activeId && activeId.toString().includes('item') && (
                                <Items item={findItem(activeId) as Item} canDelete={canDelete} />
                            )}
                            {/* Drag Overlay For Container */}
                            {activeId && activeId.toString().includes('container') && (
                                <Container canAddItem={canAdd} id={activeId} title={findContainerTitle(activeId)}>
                                    {findContainerItems(activeId).map((i) => (
                                        <Items key={i.id} item={i} canDelete={canDelete} />
                                    ))}
                                </Container>
                            )}
                        </DragOverlay>
                    </DndContext>
                </div>
            </div>
        </div>
    );
}