import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import "./style.css";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

const SliderCarousel = ({ data }) => {
  var settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <MdKeyboardArrowRight />,
    prevArrow: <MdKeyboardArrowLeft />
  };
  return (
    <Slider {...settings}>
      {data.map((item) => (
        <div>
          <img src={item} alt="" />
        </div>
      ))}
    </Slider>
  );
};

export default SliderCarousel;
