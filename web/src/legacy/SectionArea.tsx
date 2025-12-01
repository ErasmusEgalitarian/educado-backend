//icons
import Icon from "@mdi/react";
import { mdiTrashCanOutline } from "@mdi/js";

export const SectionArea = ({ sections }: { sections: unknown[] }) => {
  return (
    <div className="flex flex-col space-y-4">
      {sections.map((section: any, key) => {
        return (
          <div
            className="flex flex-row justify-between border rounded-sm py-2 px-4 cursor-pointer"
            key={key}
          >
            <p className="font-semibold">{section.title}</p>
            <button>
              <Icon path={mdiTrashCanOutline} size={0.9} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
