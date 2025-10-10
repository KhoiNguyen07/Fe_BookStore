import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState
} from "react";
import SelectBoxCustom from "~/components/SelectBoxCustom/SelectBoxCustom";
import { useSorting } from "~/hooks/useSorting";

const SortProduct = forwardRef(
  (
    { listProduct, updateSetListProductRender, sortArr, itemPerPageArr },
    ref
  ) => {
    const [showSortType, setShowSortType] = useState("ascending");
    const [showQuantity, setShowQuantity] = useState(itemPerPageArr[0].value);
    const [loadingMoreItem, setLoadingMoreItem] = useState(
      itemPerPageArr[0].value
    );
    const getValueSelect = (value, type) => {
      if (type === "sort") {
        setShowSortType(value);
      } else {
        setShowQuantity(value);
        setLoadingMoreItem(value);
      }
    };
    const { sortedList } = useSorting(listProduct, showSortType, showQuantity);

    useImperativeHandle(ref, () => ({
      handleOnclickMoreItem() {
        setShowQuantity((prev) => Number(prev) + Number(loadingMoreItem));
      }
    }));

    // handle sorting
    useEffect(() => {
      const listAfterSorting = sortedList();
      updateSetListProductRender(listAfterSorting);
    }, [showSortType, showQuantity]);

    return (
      <div className="py-5 flex justify-between">
        {/* sort */}
        <div className="flex space-x-7 items-center">
          <SelectBoxCustom
            selectOptions={sortArr}
            getValue={getValueSelect}
            type={"sort"}
          />
        </div>

        {/* show item per page */}
        <div className="flex items-center space-x-5">
          <h2>Show</h2>
          <SelectBoxCustom
            selectOptions={itemPerPageArr}
            getValue={getValueSelect}
            type={"show"}
          />
        </div>
      </div>
    );
  }
);

export default SortProduct;
