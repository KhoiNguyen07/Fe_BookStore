export const useSorting = (listProduct, showSortType, showQuantity) => {
  // sort
  const ascending = (list) => {
    return [...list].sort((a, b) => a.price - b.price);
  };
  const descending = (list) => {
    return [...list].sort((a, b) => b.price - a.price);
  };
  // quantity
  const quantityItem = (list, quantity) => {
    if (quantity == 0) return list;

    return [...list].slice(0, quantity);
  };

  // sort with quantity
  const sortedList = () => {
    let list =
      showSortType === "ascending"
        ? ascending(listProduct)
        : descending(listProduct);

    if (showQuantity !== 0) {
      list = quantityItem(list, showQuantity);
    }

    return list;
  };

  return {
    sortedList
  };
};
