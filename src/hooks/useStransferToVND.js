export const useStransferToVND = () => {
  const formatVND = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND"
    }).format(value);
  };

  return {
    formatVND
  };
};
