import { useEffect, useState } from "react";
import { MdSearch } from "react-icons/md";

export const SearchBar = ({
  sortingOptions,
  placeholderText,
  searchFn, // sortingFn,
}: {
  sortingOptions: { displayName: string; htmlValue: string }[];
  placeholderText?: string;
  searchFn: (searchString: string) => void;
  // add function for sorting
  // sortingFn
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    searchFn(searchTerm);
  }, [searchTerm]);

  return (
    <div className="flex flex-wrap justify-end items-center gap-2 p-1">
      <select className="select select-bordered">
        {sortingOptions.map((option) => (
          <option key={option.htmlValue} value={option.htmlValue}>
            {option.displayName}
          </option>
        ))}
      </select>
      <div className="flex flex-row">
        <input
          className="input input-bordered"
          type="text"
          placeholder={placeholderText}
          onChange={(event) => {
            setSearchTerm(event.target.value);
          }}
        />
        <div className="flex flex-col justify-center">
          <MdSearch className="-ml-6" />
        </div>
      </div>
    </div>
  );
};
