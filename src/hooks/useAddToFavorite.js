import { useContext, useEffect, useState } from "react";
import { favoriteService } from "~/apis/favoriteService";
import { StoreContext } from "~/contexts/StoreProvider";
import { ToastifyContext } from "~/contexts/ToastifyProvider";
import { SidebarContext } from "~/contexts/SidebarProvider";

export const useAddToFavorite = (product, isWishList) => {
  const { toast } = useContext(ToastifyContext);
  const [favoriteId, setFavoriteId] = useState(null);
  const { listItemFavorite, setIsOnClickFunction, userInfo } =
    useContext(StoreContext);
  const { setIsOpenSidebar, setTitleSidebar } = useContext(SidebarContext);

  const handleToFavorite = async () => {
    try {
      if (!isWishList) {
        if (!userInfo) {
          toast.warning("Must be sign in!");
          setIsOpenSidebar(true);
          setTitleSidebar((prev) => ({
            ...prev,
            title: "Sign in",
            key: "signin"
          }));
          return;
        }

        const customerCode =
          userInfo?.customerCode ||
          userInfo?.customer_id ||
          userInfo?._id ||
          userInfo?.id;
        const productCode = product?.productCode || product?._id || product?.id;

        const payload = { customerCode, productCode };
        const res = await favoriteService.createItem(payload);
        toast.success(
          res?.data?.message || res?.data?.data?.message || "Added to favorites"
        );
      } else {
        // delete: prefer using customerCode + productCode so backend can identify the fav entry
        const customerCode =
          userInfo?.customerCode ||
          userInfo?.customer_id ||
          userInfo?._id ||
          userInfo?.id;
        const productCode = product?.productCode || product?._id || product?.id;

        if (customerCode && productCode) {
          await favoriteService.deleteFavorite({ customerCode, productCode });
        } else if (favoriteId) {
          await favoriteService.deleteFavorite({ favoriteId });
        } else {
          // try to find favorite in listItemFavorite
          const foundEntry = (listItemFavorite || []).find((entry) => {
            const candidate = entry?.item ? entry.item : entry;
            const pid =
              candidate?.productCode ||
              candidate?.productId ||
              candidate?.id ||
              candidate?._id;
            return (
              pid === (product?.productCode || product?._id || product?.id)
            );
          });
          if (foundEntry) {
            const fid = foundEntry._id || foundEntry.id || null;
            if (fid) await favoriteService.deleteFavorite({ favoriteId: fid });
          }
        }

        toast.success("Delete successfully!");
      }

      setIsOnClickFunction((prev) => !prev);
    } catch (err) {
      console.error("Error in handleToFavorite:", err);
      toast.error("Something wrong!");
    }
  };

  return { handleToFavorite };
};
