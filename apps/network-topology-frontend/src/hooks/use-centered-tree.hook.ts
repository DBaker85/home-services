import { useState, useCallback } from "react";

export const useCenteredTree = (defaultTranslate = { x: 0, y: 0 }) => {
  const [translate, setTranslate] = useState(defaultTranslate);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [depthFactor, setDepthFactor] = useState(800);
  const containerRef = useCallback((containerElem: HTMLDivElement) => {
    console.log("containerElem", containerElem);
    if (containerElem !== null) {
      const { width, height } = containerElem.getBoundingClientRect();
      if (width < 800) {
        setDepthFactor(width);
      } else if (width > 2000) {
        setDepthFactor(2000);
      } else {
        setDepthFactor(width);
      }
      setDimensions({ width, height });
      setTranslate({ x: width / 2, y: height / 2 });
    }
  }, []);
  return { dimensions, translate, depthFactor, containerRef };
};
