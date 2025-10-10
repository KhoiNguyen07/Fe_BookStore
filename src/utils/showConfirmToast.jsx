import { toast } from "react-toastify";
import ConfirmBox from "~/components/ConfirmBox/ConfirmBox";

export const showConfirmToast = ({ message, onConfirm }) => {
  console.log(message);
  toast(
    ({ closeToast }) => (
      <ConfirmBox
        message={message}
        onConfirm={onConfirm}
        closeToast={closeToast}
      />
    ),
    {
      autoClose: false,
      closeOnClick: false,
      closeButton: false
    }
  );
};
