import React from "react";
import HeaderSidebar from "../../components/HeaderSidebar";
import EmptySidebar from "./EmptySidebar";
import ProductItemInSidebar from "../../components/ProductItemInSidebar";
import Button from "~/components/Button/Button";

const CompareSidebar = ({ titleSidebar, listItem }) => {
  const hasItems = listItem && listItem.length > 0;

  return (
    <div className="p-5 flex flex-col justify-between h-full border space-y-5">
      <HeaderSidebar titleSidebar={titleSidebar} />
      <div className="flex-1 overflow-y-auto">
        {hasItems ? (
          listItem.map((item) => <ProductItemInSidebar item={item} />)
        ) : (
          <EmptySidebar title={titleSidebar.title} />
        )}
      </div>
      {hasItems && (
        <div>
          <Button content={"VIEW COMPARE"} w="w-full" />
        </div>
      )}
    </div>
  );
};

export default CompareSidebar;
