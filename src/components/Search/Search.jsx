import React, { useEffect, useState } from "react";
import Button from "../Button/Button";
import { IoIosSearch } from "react-icons/io";
import { GrClose } from "react-icons/gr";
import { motion, AnimatePresence } from "framer-motion";
import { productService } from "~/apis/productService";
import Product from "../Product/Product";
import Loading from "../Loading/Loading";

const Search = ({ isOpenSearch, setIsOpenSearchFunction }) => {
  const [nameSearch, setNameSearch] = useState(null);
  const [listSearch, setListSearch] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const handleSearch = (value) => {
    const data = { name: value };

    productService
      .searchProduct(data)
      .then((res) => {
        setListSearch(res.data);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (!nameSearch) {
        setListSearch(null);
        return;
      }
      if (nameSearch.trim() !== "") {
        setIsLoading(true);
        setTimeout(() => {
          setIsLoading(false);
          handleSearch(nameSearch);
        }, 500);
      } else {
        setListSearch(null);
      }
    }, 1000);

    return () => clearTimeout(delayDebounce);
  }, [nameSearch]);
  return (
    <>
      {isLoading && <Loading />}
      {/* Overlay */}
      <AnimatePresence>
        {isOpenSearch && (
          <>
            <motion.div
              onClick={() => setIsOpenSearchFunction(false)}
              className="fixed inset-0 bg-black/50 z-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Modal */}
            <motion.div
              className={`fixed z-50 overflow-scroll bg-white ${
                listSearch && listSearch.length != 0 ? "h-full" : "h-3/6"
              } w-full`}
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              {/* toggle close */}
              <div
                onClick={() => setIsOpenSearchFunction(false)}
                className="absolute right-5 top-5 text-xl xl:text-3xl cursor-pointer transition-transform duration-300 hover:rotate-180"
              >
                <GrClose />
              </div>

              <div className="flex flex-col justify-center items-center space-y-5">
                <h2 className="text-xl xl:text-3xl pt-5">
                  What Are You Looking For?
                </h2>

                {/* search input */}
                <div className="flex justify-center">
                  <div className="border">
                    <input
                      onChange={(e) => {
                        setNameSearch(e.target.value ? e.target.value : null);
                      }}
                      type="text"
                      className="outline-none p-2 w-[150px] xl:w-[500px]"
                      placeholder="Search for products"
                    />
                  </div>
                  <div>
                    <Button
                      onClick={() => {
                        handleSearch(nameSearch);
                      }}
                      w="w-[50px]"
                      borderRadius=""
                      content={
                        <>
                          <div className="flex items-center space-x-2">
                            <IoIosSearch />
                            <span>Search</span>
                          </div>
                        </>
                      }
                    />
                  </div>
                </div>
              </div>

              {/* search result */}
              {listSearch?.length > 0 ? (
                <div className="mt-20 flex flex-col items-center justify-center space-y-10">
                  <h2 className="text-3xl">PRODUCT FOUND</h2>
                  <div className="flex flex-wrap justify-center xl:justify-start items-center gap-5 w-full px-10">
                    {listSearch?.map((item) => (
                      <div className="w-60">
                        <Product item={item} />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mt-10 flex flex-col items-center justify-center space-y-10">
                  <h2 className="text-3xl">NO PRODUCT FOUND</h2>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Search;
