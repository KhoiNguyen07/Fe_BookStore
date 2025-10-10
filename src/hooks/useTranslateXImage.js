import { useEffect, useState } from "react";
import { useScrollHandling } from "./useScrollHandling";

export const useTranslateXImage = () => {
  const { scrollDirection, scrollCurrentPosition } = useScrollHandling();
  const [translateX, setTranslateX] = useState(0);

  const translateXPosition = () => {
    if (scrollDirection == "down" && scrollCurrentPosition >= 1200) {
      setTranslateX(translateX >= 120 ? 120 : translateX + 1);
    } else if (scrollDirection == "up") {
      setTranslateX(translateX <= 0 ? 0 : translateX - 1);
    }
  };

  useEffect(() => {
    const isMobile = window.innerWidth <= 1024;
    if (isMobile) return;
    translateXPosition();
  }, [scrollCurrentPosition]);

  return translateX;
};
