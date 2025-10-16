import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
  useMemo
} from "react";
import SelectBoxCustom from "~/components/SelectBoxCustom/SelectBoxCustom";
import { useSorting } from "~/hooks/useSorting";
import { categoryService } from "~/apis/categoryService";
import { useLanguage } from "~/contexts/LanguageProvider";

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
    const [showCategory, setShowCategory] = useState("all");
    const [categoryOptions, setCategoryOptions] = useState([
      { value: "all", title: "All" }
    ]);
    const { t } = useLanguage();
    const getValueSelect = (value, type) => {
      if (type === "sort") {
        setShowSortType(value);
      } else if (type === "category") {
        setShowCategory(value);
      } else {
        setShowQuantity(value);
        setLoadingMoreItem(value);
      }
    };

    // derive filtered list by selected category before sorting/pagination
    const filteredByCategory = useMemo(() => {
      if (!Array.isArray(listProduct)) return [];
      if (!showCategory || showCategory === "all") return listProduct;

      return listProduct.filter((p) => {
        const code = p.categoryCode || p.category || p.categoryCode;
        return code === showCategory;
      });
    }, [listProduct, showCategory]);

    const { sortedList } = useSorting(
      filteredByCategory,
      showSortType,
      showQuantity
    );

    useImperativeHandle(ref, () => ({
      handleOnclickMoreItem() {
        setShowQuantity((prev) => Number(prev) + Number(loadingMoreItem));
      }
    }));

    // handle sorting
    useEffect(() => {
      const listAfterSorting = sortedList();
      updateSetListProductRender(listAfterSorting);
    }, [showSortType, showQuantity, showCategory]);

    // fetch categories from API
    useEffect(() => {
      let mounted = true;
      categoryService
        .getAllCategory()
        .then((res) => {
          const data = res?.data?.data || res?.data || [];
          if (!mounted || !Array.isArray(data)) return;

          const opts = [
            { value: "all", title: t ? t("common.all") || "All" : "All" },
            ...data.map((c) => ({
              value: c.categoryCode || c.code || c.id,
              title: c.categoryName || c.name || c.title || c.categoryName
            }))
          ];
          setCategoryOptions(opts);
        })
        .catch((err) => {
          console.error("Failed to load categories:", err);
        });

      return () => {
        mounted = false;
      };
    }, [t]);

    return (
      <div className="py-5 flex justify-between">
        {/* sort + category */}
        <div className="flex space-x-4 items-center">
          <SelectBoxCustom
            selectOptions={sortArr}
            getValue={getValueSelect}
            type={"sort"}
          />
          <div className="w-56">
            <SelectBoxCustom
              selectOptions={categoryOptions}
              getValue={getValueSelect}
              type={"category"}
            />
          </div>
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
