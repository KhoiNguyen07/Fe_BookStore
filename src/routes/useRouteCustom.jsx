import React from "react";
import { useRoutes } from "react-router-dom";
import { path } from "~/assets/Path/path";
import DetailProduct from "~/pages/DetailProduct/DetailProduct";
import Cart from "~/pages/Cart/Cart";
import HomePage from "~/pages/HomePage/HomePage";
import OurShop from "~/pages/OurShop/OurShop";
import Order from "~/pages/Order/Order";
import PageNotFound from "~/components/PageNotFound/PageNotFound";
import About from "~/pages/About/About";

const useRouteCustom = () => {
  const elements = useRoutes([
    {
      path: "*",
      element: <PageNotFound />
    },
    {
      path: path.Homepage,
      element: <HomePage />
    },
    {
      path: path.About,
      element: <About />
    },
    {
      path: path.OurShop,
      element: <OurShop />
    },
    {
      path: path.Cart,
      element: <Cart />
    },
    {
      path: path.Product,
      element: <DetailProduct />
    },
    {
      path: path.Order,
      element: <Order />
    }
  ]);
  return elements;
};

export default useRouteCustom;
