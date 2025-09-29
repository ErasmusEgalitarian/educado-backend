// DND-KIT
import {
  UniqueIdentifier,
  DragEndEvent,
  DndContext,
  closestCenter,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useState } from "react";

import { useSections } from "@contexts/courseStore";

// Components
import { Component } from "@interfaces/Course";

import { Item } from "./@dnd/Item";

// Intefaces
import { SortableComponentItem } from "./@dnd/SortableComponentItem";

interface Props {
  sid: string;
  components: Component[];
}

export const ComponentList = ({ sid, components }: Props) => {
  // States
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const { updateCachedSectionComponents } = useSections();
  // Setup of pointer and keyboard sensor
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // handle start of dragging
  const handleDragStart = (event: { active: { id: UniqueIdentifier } }) => {
    const { active } = event;
    setActiveId(active.id);
  };

  // handle end of dragging
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over === null || active.id === over.id) return;
    const adjustComponents = () => {
      const oldIndex = components.findIndex(
        (component) => component.compId === active.id,
      );
      const newIndex = components.findIndex(
        (component) => component.compId === over.id,
      );
      return arrayMove(components, oldIndex, newIndex);
    };

    const newComponents = adjustComponents();
    updateCachedSectionComponents(sid, newComponents);
  };

  return (
    <div className="w-full">
      <DndContext
        modifiers={[restrictToVerticalAxis]}
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={components.map((comp) => comp._id)}
          strategy={verticalListSortingStrategy}
        >
          {components.map((comp) => (
            <SortableComponentItem key={comp._id} component={comp} sid={sid} />
          ))}
        </SortableContext>

        <DragOverlay className="w-full">
          {activeId !== null ? <Item id={activeId} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};
