import React, { use, useContext, useEffect, useState } from "react";
import HeaderSidebar from "../../components/HeaderSidebar";
import ProductItemInSidebar from "../../components/ProductItemInSidebar";
import Button from "~/components/Button/Button";
import EmptySidebar from "./EmptySidebar";
import { StoreContext } from "~/contexts/StoreProvider";
import { Link } from "react-router-dom";
import { SidebarContext } from "~/contexts/SidebarProvider";
import { useStransferToVND } from "~/hooks/useStransferToVND";

const CartSidebar = ({ titleSidebar }) => {
  // store information
  const { userInfo, listItemCart, totalPrice } = useContext(StoreContext);
  const { setIsOpenSidebar } = useContext(SidebarContext);
  const listItemCartRender = listItemCart ? [...listItemCart].reverse() : null;
  const [hasItems, setHasItems] = useState(false);
  const { formatVND } = useStransferToVND();

  useEffect(() => {
    setHasItems(userInfo && listItemCart && listItemCart.length > 0);
  }, [userInfo, listItemCart]);

  return (
    <>
      <div className="p-5 flex flex-col justify-between h-full border space-y-5">
        <HeaderSidebar titleSidebar={titleSidebar} />
        <div className="flex-1 overflow-y-auto">
          {hasItems ? (
            listItemCartRender.map((items) => {
              const { item } = items;
              return (
                <ProductItemInSidebar
                  key={items._id}
                  item={{ ...item, productId: item.productId.slice(-5) }}
                  cartId={items._id}
                />
              );
            })
          ) : (
            <EmptySidebar title={titleSidebar.title} />
          )}
        </div>
        {hasItems && (
          <>
            {" "}
            <div className="flex justify-between">
              <p>Total price: </p>
              <p className="text-gray-600">
                {formatVND(totalPrice(listItemCart))}
              </p>
            </div>
            <div className="space-y-3">
              <Link to={"/cart"}>
                <Button
                  onClick={() => {
                    setIsOpenSidebar(false);
                  }}
                  content={"VIEW CART"}
                  w="w-full"
                />
              </Link>
              <Button
                content={"CHECKOUT"}
                w="w-full"
                hoverTextColor={"hover:text-white"}
                bgColor={"bg-transparent"}
                hoverBgColor={"hover:bg-black"}
                textColor={"text-black"}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default CartSidebar;
