import React, { useContext, useEffect, useState } from "react";
import { orderService } from "~/apis/orderService";
import Button from "~/components/Button/Button";
import { StoreContext } from "~/contexts/StoreProvider";
import { useStransferToVND } from "~/hooks/useStransferToVND";
import OrderDetailModal from "./OrderDetailModal";
import { showConfirmToast } from "~/utils/showConfirmToast";
import { ToastifyContext } from "~/contexts/ToastifyProvider";
import { MdOutlineShoppingCart } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const MainContent = () => {
  const [listOrder, setListOrder] = useState(null);
  const { toast } = useContext(ToastifyContext);
  const { userInfo } = useContext(StoreContext);
  const { formatVND } = useStransferToVND();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [open, setOpen] = useState(false);
  const [reload, setReload] = useState(false);
  const navigate = useNavigate();

  const handleViewDetail = (order) => {
    setSelectedOrder(order);
    setOpen(true);
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth" // cuộn mượt
    });
    orderService
      .findOneByUserId({ userId: userInfo._id })
      .then((res) => {
        setListOrder(res.data);
      })
      .catch();
  }, [reload]);

  const handleCancelOrder = (orderId, value = "cancel") => {
    const data = {
      id: orderId,
      value
    };
    console.log(data);
    showConfirmToast({
      message: "Are you sure cancel this order?",
      onConfirm: () => {
        orderService
          .updateStatusByOrderId(data)
          .then((res) => {
            res.data.data == 1
              ? toast.success(res.data.message)
              : toast.error(res.data.message);
            setReload((prev) => !prev);
          })
          .catch();
      }
    });
  };
  return (
    <div className="py-10 px-4">
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold mb-8">My Orders</h2>

        {/* Order Card */}
        {listOrder?.length > 0 ? (
          <>
            {[...listOrder]?.reverse().map((item) => (
              <div className="bg-white shadow-lg p-6 mb-6 hover:shadow-2xl transition">
                <div className="flex justify-between items-center mb-4">
                  <h5 className="text-lg font-semibold">
                    Order ID: <span className="text-blue-600">{item._id}</span>
                  </h5>
                  <span
                    className={`px-3 py-1  text-sm font-medium bg-blue-200 ${
                      item.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : item.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : item.status === "shipping"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <p className="text-gray-600">
                  <strong>Order Date:</strong>
                  {new Date(item.createAt).toLocaleDateString("en-GB")}
                </p>
                <p className="text-gray-600">
                  <strong>Total:</strong>{" "}
                  <span className="text-red-500 font-semibold">
                    {formatVND(item.totalPriceOrder)}
                  </span>
                </p>

                {/* Product list */}
                <div className="mt-4">
                  <h6 className="font-medium mb-2">Products:</h6>
                  <ul className="space-y-2">
                    {item.listProduct.map((product) => (
                      <li className="flex justify-between border-b pb-2">
                        <span>{product.name}</span>
                        <span>x{product.quantity}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap justify-center xl:justify-end mt-4 gap-2">
                  <div className="w-full xl:w-1/6">
                    <Button
                      onClick={() => {
                        handleViewDetail(item);
                      }}
                      content={"View detail"}
                      w={"w-full"}
                    />
                  </div>
                  <div className="w-full xl:w-1/6">
                    <Button
                      onClick={() => {
                        handleCancelOrder(item._id);
                      }}
                      content={"Cancel"}
                      hoverTextColor={"hover:text-white"}
                      bgColor={"bg-transparent"}
                      hoverBgColor={"hover:bg-black"}
                      textColor={"text-black"}
                      w={"w-full"}
                    />
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className=" flex flex-col text-center justify-center items-center space-y-3">
            <span className="text-7xl">
              <MdOutlineShoppingCart />
            </span>
            <h2 className="text-3xl uppercase">You don’t have any orders</h2>
            <p>
              We invite you to get acquainted with an assortment of out shop.
              Surely you can find something for yourself!
            </p>
            <Button
              onClick={() => {
                navigate("/shop");
              }}
              content={"Go to shop"}
            />
          </div>
        )}
      </div>

      {/* Modal chi tiết */}
      <OrderDetailModal
        isOpen={open}
        onClose={() => setOpen(false)}
        order={selectedOrder}
      />
    </div>
  );
};

export default MainContent;
