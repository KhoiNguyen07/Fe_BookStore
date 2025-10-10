import { StoreContext } from "~/contexts/StoreProvider";
import { useContext } from "react";
import { ToastifyContext } from "~/contexts/ToastifyProvider";
import { SidebarContext } from "~/contexts/SidebarProvider";
import { cartService } from "~/apis/cartService";

export const useAddToCart = (item, selectedSize, quantity = 1) => {
  const { userInfo, setIsOnClickFunction } = useContext(StoreContext);
  const { setIsOpenSidebar, setTitleSidebar, titleSidebar } =
    useContext(SidebarContext);
  const { toast } = useContext(ToastifyContext);

  const handleAddToCart = () => {
    if (!userInfo) {
      toast.warning("Must be sign in!");
      setIsOpenSidebar(true);
      setTitleSidebar({ ...titleSidebar, title: "Sign in" });
      return;
    }
    if (!selectedSize) {
      toast.warning("Choose your size!");
      return;
    }

    const data = {
      userId: userInfo._id,
      item: {
        productId: item._id,
        name: item.name,
        size: selectedSize,
        quantity: quantity,
        image: item.images[0],
        price: item.price
      }
    };

    cartService
      .createItem(data)
      .then((res) => {
        setIsOpenSidebar(true);
        setTitleSidebar({ ...titleSidebar, title: "cart" });
        toast.success(res.data.message);
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
