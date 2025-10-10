import React, { useContext, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { commentService } from "~/apis/commentService";
import Loading from "~/components/Loading/Loading";
import { ToastifyContext } from "~/contexts/ToastifyProvider";
import { showConfirmToast } from "~/utils/showConfirmToast";
const CommentCustom = ({ item, userInfo, setIsResetComment }) => {
  const { toast } = useContext(ToastifyContext);
  const [isLoading, setIsLoading] = useState(false);
  const handDeleteComment = (commentId) => {
    showConfirmToast({
      message: "Are you sure delelete this comment?",
      onConfirm: () => {
        if (!commentId || !userInfo) return;
        const data = { commentId, userId: userInfo._id };
        commentService
          .deleteComment(data)
          .then((res) => {
            setIsLoading(true);
            setTimeout(() => {
              setIsLoading(false);
              setIsResetComment((prev) => !prev);
              if (res.data.success) {
                toast.success(res.data.message);
              } else {
                toast.warning(res.data.message);
              }
            }, 1000);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  };

  return (
    <>
      {isLoading && <Loading />}
      <div className="flex flex-col space-y-3 hover:bg-gray-200 p-3 duration-500">
        {/* Header */}
        <div className="flex items-baseline justify-between">
          <div className="flex space-x-3 items-baseline">
            <h2 className="font-bold leading-none text-xl">{item.username}</h2>
            <p className="text-xs text-gray-500">
              {new Date(item.createAt).toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
              })}{" "}
              {new Date(item.createAt).toLocaleTimeString("vi-VN")}
            </p>
          </div>

          {/* Delete Button */}
          <button
            onClick={() => {
              handDeleteComment(item._id);
            }}
            className="text-sm hover:text-red-700 transition"
          >
            <AiOutlineDelete />
          </button>
        </div>

        {/* Comment Content */}
        <p>{item.comment}</p>
      </div>
    </>
  );
};

export default CommentCustom;
