import React, { useContext } from "react";
import HeaderSidebar from "../../components/HeaderSidebar";
import ProductItemInSidebar from "../../components/ProductItemInSidebar";
import Button from "~/components/Button/Button";
import EmptySidebar from "./EmptySidebar";
import { StoreContext } from "~/contexts/StoreProvider";

const WishlistSidebar = ({ titleSidebar }) => {
  const { listItemFavorite } = useContext(StoreContext);
  const hasItems = listItemFavorite && listItemFavorite.length > 0;
  return (
    <div className="p-5 flex flex-col justify-between h-full border space-y-5">
      <HeaderSidebar titleSidebar={titleSidebar} />
      <div className="flex-1 overflow-y-auto">
        {hasItems ? (
          listItemFavorite.map((items) => {
            const { item } = items;
            return <ProductItemInSidebar item={item} favoriteId={items._id} />;
          })
        ) : (
          <EmptySidebar title={titleSidebar.title} />
        )}
      </div>
      {hasItems && (
        <div className="space-y-3">
          <Button content={"VIEW WISHLIST"} w="w-full" />
          <Button
            content={"ADD ALL TO CART"}
            w="w-full"
            hoverTextColor={"hover:text-white"}
            bgColor={"bg-transparent"}
            hoverBgColor={"hover:bg-black"}
            textColor={"text-black"}
          />
        </div>
      )}
    </div>
  );
};

export default WishlistSidebar;
