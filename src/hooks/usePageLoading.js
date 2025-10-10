import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function usePageLoading(delay = 300) {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), delay);
    return () => clearTimeout(timeout);
  }, [location.pathname]);

  return loading;
}
