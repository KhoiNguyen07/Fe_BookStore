import { StoreContext } from "~/contexts/StoreProvider";
import { useContext } from "react";
import { ToastifyContext } from "~/contexts/ToastifyProvider";
import { SidebarContext } from "~/contexts/SidebarProvider";
import { cartService } from "~/apis/cartService";

export const useAddToCart = (item, quantity = 1, size = null) => {
  const { userInfo, setIsOnClickFunction } = useContext(StoreContext);
  const { setIsOpenSidebar, setTitleSidebar, titleSidebar } =
    useContext(SidebarContext);
  const { toast } = useContext(ToastifyContext);

  const handleAddToCart = () => {
    if (!userInfo) {
      toast.warning("Must be sign in!");
      setIsOpenSidebar(true);
      setTitleSidebar({ ...titleSidebar, title: "Sign in", key: "signin" });
      return;
    }

    // normalize customerCode and productCode across possible shapes
    const customerCode =
      userInfo?.customerCode ||
      userInfo?.customer_id ||
      userInfo?._id ||
      userInfo?.id;
    const productCode =
      item?.productCode || item?.productId || item?._id || item?.id;

    const data = {
      customerCode,
      productCode,
      quantity: quantity
    };

    // include size if provided (optional)
    if (size) data.size = size;

    console.log("AddToCart payload:", data, "userInfo:", userInfo);

    cartService
      .createItem(data)
      .then((res) => {
        console.log("createItem response:", res);
        setIsOpenSidebar(true);
        setTitleSidebar({ ...titleSidebar, title: "cart", key: "cart" });
        toast.success(
          res?.data?.message || res?.data?.data?.message || "Added to cart"
        );
        setIsOnClickFunction((prev) => !prev);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something wrong!");
      });
  };

  return {
    handleAddToCart
  };
};
