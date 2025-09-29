import {
  DndContext,
  closestCenter,
  DragOverlay,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  UniqueIdentifier,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useState } from "react";

import { useNotifications } from "@/shared/context/NotificationContext";
import { useSections, useCourse } from "@/course/context/courseStore";

import { Item } from "./@dnd/Item";
import { SortableItem } from "./@dnd/SortableItem";

interface Props {
  sections: string[];
}

export const SectionList = ({ sections }: Props) => {
  // States
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [savedSID, setSavedSID] = useState<string>("");

  const { deleteCachedSection } = useSections();
  const { updateCachedCourseSections } = useCourse();
  const { addNotification } = useNotifications();

  // Setup of pointer and keyboard sensor
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleSectionDeletion = (sId: string) => {
    if (confirm("Tem certeza que deseja excluir?")) {
      addNotification("Seção excluída");
      deleteCachedSection(sId);
    }
  };
  const handleDragStart = (event: { active: { id: UniqueIdentifier } }) => {
    const { active } = event;
    setActiveId(active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over === null || active.id === over.id) return;
    const getAdjustedSectionList = () => {
      const oldIndex = sections.findIndex((section) => section === active.id);
      const newIndex = sections.findIndex((section) => section === over.id);
      const result = arrayMove(sections, oldIndex, newIndex);
      return result;
    };
    updateCachedCourseSections(getAdjustedSectionList());

    setActiveId(null);
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
          items={sections}
          strategy={verticalListSortingStrategy}
        >
          {sections.map((section, index) => (
            <SortableItem
              key={section}
              sid={section}
              sectionNumber={index + 1}
              savedSID={savedSID}
              setSavedSID={setSavedSID}
              handleSectionDeletion={handleSectionDeletion}
            />
          ))}
        </SortableContext>

        <DragOverlay className="w-full">
          {activeId !== null ? <Item id={activeId} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};
