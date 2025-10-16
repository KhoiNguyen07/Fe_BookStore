import React, { createContext, useState } from "react";

export const StoreContext = createContext();

// // login default
// const user = {
//   _id: "68b07f99219dc1142ca9937f",
//   email: "abc123@gmail.com",
//   password: "123456",
//   username: "khoinguyenne"
// };

const StoreProvider = ({ children }) => {
  // const [userInfo, setUserInfo] = useState(() => {
  //   const savedUser = localStorage.getItem("userInfo");
  //   return savedUser ? JSON.parse(savedUser) : user;
  // });
  const [userInfo, setUserInfo] = useState(null);

  // onlick
  const [isOnclick, setIsOnclick] = useState(false);
  const setIsOnClickFunction = (value) => {
    setIsOnclick(value);
  };
  // list favorite
  const handleFavoriteItem = (list, proId) => {
    return list?.some((items) => {
      const { item } = items;
      return item.productId === proId;
    });
  };

  //  favorite
  const [listItemFavorite, setListItemFavorite] = useState(null);
  const [countItemFavor, setCountItemFavor] = useState(0);
  const setCountItemFavorFunction = (value) => {
    setCountItemFavor(value);
  };
  const setListItemFavoriteFunction = (value) => {
    setListItemFavorite(value);
  };

  // list cart
  const [listItemCart, setListItemCart] = useState([
    {
      item: {
        productId: "64f100000000000000000001",
        name: "Atlas",
        author: "F. Scott Fitzgerald",
        category: "Fiction",
        quantity: 2,
        description:
          "A classic novel that explores themes of wealth, love, and the American Dream.",
        price: 250,
        formats: ["Hardcover", "Paperback", "Ebook"],
        images: ["/product_img/p1/1.jpg", "/product_img/p1/2.jpg"]
      }
    }
  ]);

  const [countItem, setCountItem] = useState(0); // count of list cart
  // checkout payment
  const [coupon, setCoupon] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);

  // order on payment
  const [order, setOrder] = useState(null);
  const setOrderFunction = (value) => {
    setOrder(value);
  };

  // total price
  const totalPrice = (list) => {
    let total = 0;
    list.forEach(({ item }) => {
      total += item.quantity * item.price;
    });
    return total.toFixed(2);
  };
  // total item
  const totalItem = (list) => {
    if (!list) return 0;
    let total = 0;
    list.forEach(({ item }) => {
      total += item.quantity;
    });

    return total;
  };

  return (
    <StoreContext.Provider
      value={{
        setIsOnClickFunction,
        isOnclick,
        userInfo,
        setUserInfo,
        // favorite
        handleFavoriteItem,
        listItemFavorite,
        setListItemFavoriteFunction,
        countItemFavor,
        setCountItemFavorFunction,
        // cart
        listItemCart,
        setListItemCart,
        totalPrice,
        totalItem,
        countItem,
        setCountItem,
        coupon,
        setCoupon,
        currentTab,
        setCurrentTab,
        order,
        setOrderFunction
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export default StoreProvider;
