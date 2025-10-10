import React, { useState } from "react";
import { Rating } from "@smastrom/react-rating";

import "@smastrom/react-rating/style.css";

const RatingCustom = () => {
  const [rating, setRating] = useState(null);
  return (
    <Rating style={{ maxWidth: 180 }} value={rating} onChange={setRating} />
  );
};

export default RatingCustom;
