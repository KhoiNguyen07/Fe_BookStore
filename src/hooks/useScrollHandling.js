import { useEffect, useRef, useState } from "react";

export const useScrollHandling = () => {
  const [scrollDirection, setScrollDirection] = useState(null);
  const previousScrollPosition = useRef(0);
  const [scrollCurrentPosition, setScrollCurrentPostion] = useState(0);

  const checkingScrollDirection = () => {
    const currentScrollPosition = window.pageYOffset;
    if (currentScrollPosition > previousScrollPosition.current) {
      setScrollDirection("down");
    } else if (currentScrollPosition < previousScrollPosition.current) {
      setScrollDirection("up");
    }

    previousScrollPosition.current = currentScrollPosition;
    setScrollCurrentPostion(currentScrollPosition);
  };

  useEffect(() => {
    window.addEventListener("scroll", checkingScrollDirection);
    return () => window.removeEventListener("scroll", checkingScrollDirection);
  }, []);

  return {
    scrollDirection,
    scrollCurrentPosition
  };
};
