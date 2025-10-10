import { useEffect, useState } from "react";
export const useAnimationSidebar = (isOpenSidebar, position = "right") => {
  const [shouldRender, setShouldRender] = useState(false);
  const [animationClass, setAnimationClass] = useState("");

  useEffect(() => {
    if (isOpenSidebar) {
      setShouldRender(true);
      setAnimationClass(
        position === "left" ? "slideInFromLeft" : "slideInFromRight"
      );
    } else {
      setAnimationClass(
        position === "left" ? "slideOutToLeft" : "slideOutToRight"
      );
      setTimeout(() => {
        setShouldRender(false);
      }, 400); // Match duration in your animation
    }
  }, [isOpenSidebar, position]);
  return {
    shouldRender,
    animationClass
  };
};
