import React, { useContext } from "react";
import { CiSearch } from "react-icons/ci";
import { SearchContext } from "~/contexts/SearchProvider";

const SearchToggle = () => {
  const { setIsOpenSearchFunction } = useContext(SearchContext);
  return (
    <div
      onClick={() => {
        setIsOpenSearchFunction(true);
      }}
      className="block text-xl xl:hidden absolute right-0 top-1/2 -translate-y-1/2 px-5"
    >
      <CiSearch />
    </div>
  );
};

export default SearchToggle;
