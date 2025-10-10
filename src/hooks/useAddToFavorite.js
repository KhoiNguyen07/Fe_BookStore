import { useContext, useEffect, useState } from "react";
import { favoriteService } from "~/apis/favoriteService";
import { StoreContext } from "~/contexts/StoreProvider";
import { ToastifyContext } from "~/contexts/ToastifyProvider";

export const useAddToFavorite = (product, isWishList) => {
  const { toast } = useContext(ToastifyContext);
  const [favoriteId, setFavoriteId] = useState(null);
  const { listItemFavorite, setIsOnClickFunction, userInfo } =
    useContext(StoreContext);

  useEffect(() => {
    const fetchFavorite = async () => {
      try {
        const res = await favoriteService.findOneByProductId({
          productId: product._id
        });
        setFavoriteId(res.data?._id);
      } catch (err) {
        console.error("Error fetching favorite:", err);
      }
    };

    fetchFavorite();
  }, [listItemFavorite, product._id]);

  const handleToFavorite = async () => {
    try {
      if (!isWishList) {
        if (!userInfo) {
          toast.warning("Must be sign in!");
          setIsOpenSidebar(true);
          setTitleSidebar((prev) => ({ ...prev, title: "Sign in" }));
          return;
        }

        const data = {
          userId: userInfo._id,
          item: {
            productId: product._id,
            name: product.name,
            image: product.images[0],
            price: product.price
          }
        };

        const res = await favoriteService.createItem(data);
        toast.success(res.data.message);
      } else {
        await favoriteService.deleteFavorite({ favoriteId });
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
