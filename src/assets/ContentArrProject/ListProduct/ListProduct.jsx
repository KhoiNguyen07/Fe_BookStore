import { TfiReload } from "react-icons/tfi";
import { FaEye } from "react-icons/fa";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import FavoriteItemAnimation from "~/components/FavoriteItemAnimation/FavoriteItemAnimation";
export const productIcon = [
  {
    code: "detail",
    icon: <HiOutlineShoppingBag />
  },
  {
    code: "",
    icon: <TfiReload />
  },
  {
    code: "see",
    icon: <FaEye />
  }
];

export const listProduct = [
  {
    id: 1,
    images: [
      "/Product_img/1/1_1.jpeg",
      "/Product_img/1/1_2.jpeg",
      "/Product_img/1/1_3.jpeg",
      "/Product_img/1/1_4.jpeg"
    ],
    name: "10K Yellow Gold",
    price: "$99.99",
    description:
      "Amet, elit tellus, nisi odio velit ut. Euismod sit arcu, quisque arcu purus orci leo."
  },
  {
    id: 2,
    images: [
      "/Product_img/2/2_1.jpeg",
      "/Product_img/2/2_2.jpeg",
      "/Product_img/2/2_3.jpeg",
      "/Product_img/2/2_4.jpeg"
    ],
    name: "Consectetur nibh at",
    price: "$119.99",
    description:
      "Amet, elit tellus, nisi odio velit ut. Euismod sit arcu, quisque arcu purus orci leo."
  },
  {
    id: 3,
    images: [
      "/Product_img/3/3_1.jpeg",
      "/Product_img/3/3_2.jpeg",
      "/Product_img/3/3_3.jpeg",
      "/Product_img/3/3_4.jpeg"
    ],
    name: "Volutpat lacus",
    price: "$435.00",
    description:
      "Amet, elit tellus, nisi odio velit ut. Euismod sit arcu, quisque arcu purus orci leo."
  },
  {
    id: 4,
    images: [
      "/Product_img/4/4_1.jpeg",
      "/Product_img/4/4_2.jpeg",
      "/Product_img/4/4_4.jpeg",
      "/Product_img/4/4_4.jpeg"
    ],
    name: "Nunc sed augue",
    price: "$120.30",
    description:
      "Amet, elit tellus, nisi odio velit ut. Euismod sit arcu, quisque arcu purus orci leo."
  },
  {
    id: 5,
    images: [
      "/Product_img/5/5_1.jpeg",
      "/Product_img/5/5_2.jpeg",
      "/Product_img/5/5_3.jpeg",
      "/Product_img/5/5_4.jpeg"
    ],
    name: "Rhoncus facilisis tempus",
    price: "$879.99 – $888.99",
    description:
      "Amet, elit tellus, nisi odio velit ut. Euismod sit arcu, quisque arcu purus orci leo."
  },
  {
    id: 6,
    images: [
      "/Product_img/6/6_1.jpeg",
      "/Product_img/6/6_2.jpeg",
      "/Product_img/6/6_3.jpeg",
      "/Product_img/6/6_4.jpeg"
    ],
    name: "Volutpat lacus",
    price: "$879.99 – $888.99",
    description:
      "Amet, elit tellus, nisi odio velit ut. Euismod sit arcu, quisque arcu purus orci leo."
  }
];
