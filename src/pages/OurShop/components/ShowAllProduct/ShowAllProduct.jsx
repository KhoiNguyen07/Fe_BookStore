import React from "react";
import Product from "~/components/Product/Product";
import { motion, AnimatePresence } from "framer-motion";

const ShowAllProduct = ({ listProduct }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-x-5 gap-y-10">
      <AnimatePresence>
        {listProduct?.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Product item={item} addCartBtn={true} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ShowAllProduct;
