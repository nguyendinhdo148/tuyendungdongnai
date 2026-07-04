import { useEffect, useLayoutEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const scrollPositions: Record<string, number> = {};

const ScrollRestoration = () => {
  const location = useLocation();
  const prevPathRef = useRef<string>("");

  useLayoutEffect(() => {
    const prevPath = prevPathRef.current;
    if (prevPath) {
      scrollPositions[prevPath] = window.scrollY;
    }
  }, [location.pathname]);

  useEffect(() => {
    const scrollY = scrollPositions[location.pathname];

    if (scrollY !== undefined) {
      // Khôi phục vị trí scroll nếu quay lại
      window.scrollTo({ top: scrollY, behavior: "instant" });
    } else {
      // Scroll to top nếu là trang mới
      window.scrollTo({ top: 0, behavior: "instant" });
    }

    prevPathRef.current = location.pathname;
  }, [location.pathname]);

  return null;
};

export default ScrollRestoration;
