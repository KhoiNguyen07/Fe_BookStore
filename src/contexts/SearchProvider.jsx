import React, { createContext, useState } from "react";

export const SearchContext = createContext();

const SearchProvider = ({ children }) => {
  const [isOpenSearch, setIsOpenSearch] = useState(false);

  const setIsOpenSearchFunction = (value) => {
    setIsOpenSearch(value);
  };

  return (
    <SearchContext.Provider
      value={{
        isOpenSearch,
        setIsOpenSearchFunction
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export default SearchProvider;
