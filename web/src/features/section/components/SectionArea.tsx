//icons
import { TrashIcon } from "@heroicons/react/24/outline";

export const SectionArea = ({ sections }: { sections: unknown[] }) => {
  return (
    <div className="flex flex-col space-y-4">
      {sections.map((section: any, key) => {
        return (
          <div
            className="flex flex-row justify-between border rounded py-2 px-4 cursor-pointer"
            key={key}
          >
            <p className="font-semibold">{section.title}</p>
            <button>
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
