import Icon from "@mdi/react";
import { mdiClose } from "@mdi/js";

export const CategoryPill = ({ category }: { category: string }) => {
  return (
    <span className="px-3 py-1 flex items-center text-lg rounded-full bg-blue-500 hover:bg-blue-700 text-white shadow-sm cursor-pointer">
      <span>{category}</span>
      <button className="bg-transparent">
        <Icon
          path={mdiClose}
          size={0.5}
          color="currentColor"
          className="ml-2"
        />
      </button>
    </span>
  );
};
