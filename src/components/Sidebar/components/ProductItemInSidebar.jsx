import React, { useContext } from "react";
import { IoMdClose } from "react-icons/io";
import { cartService } from "~/apis/cartService";
import { favoriteService } from "~/apis/favoriteService";
import { StoreContext } from "~/contexts/StoreProvider";
import { ToastifyContext } from "~/contexts/ToastifyProvider";
import { useStransferToVND } from "~/hooks/useStransferToVND";
import { showConfirmToast } from "~/utils/showConfirmToast";

const ProductItemInSidebar = ({
  item: { productId, image, name, price, quantity = null, size = null },
  cartId = null,
  favoriteId = null
}) => {
  const { toast } = useContext(ToastifyContext);
  const { setIsOnClickFunction } = useContext(StoreContext);
  const { formatVND } = useStransferToVND();
  const handleDelete = () => {
    showConfirmToast({
      message: "Are you sure delete this item?",
      onConfirm: () => {
        if (cartId) {
          cartService
            .deleteCart({ cartId })
            .then(() => {
              toast.success("Delete successfully!");
              setIsOnClickFunction((prev) => !prev);
            })
            .catch();
        } else {
          favoriteService
            .deleteFavorite({ favoriteId })
            .then(() => {
              toast.success("Delete successfully!");
              setIsOnClickFunction((prev) => !prev);
            })
            .catch();
        }
      }
    });
  };

  return (
    <>
      <div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.3 }}
        className="group relative flex items-center px-3 py-5 w-full hover:bg-gray-100 transition-colors duration-300"
      >
        {/* Hình ảnh */}
        <div className="w-1/3">
          <img className="w-[70px] h-[85px]" src={image} alt="Product" />
        </div>

        {/* Thông tin */}
        <div className="w-2/3">
          <h2 className="text-xl">{name}</h2>
          <p>SKU: {productId.slice(-5)}</p>
          <div className="text-gray-600">
            {quantity && size ? (
              <>
                <p>Size: {size}</p>
                <span>{quantity} x </span> {formatVND(price)}
              </>
            ) : (
              <p>{formatVND(price)}</p>
            )}
          </div>
        </div>

        {/* Nút X */}
        <button
          onClick={handleDelete}
          className="absolute top-5 right-5 text-xl text-gray-600 opacity-0 translate-x-3 pointer-events-none
            transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100 group-hover:pointer-events-auto"
        >
          <IoMdClose />
        </button>
      </div>
    </>
  );
};

export default ProductItemInSidebar;
