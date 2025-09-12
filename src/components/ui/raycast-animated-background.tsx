import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import UnicornScene from "unicornstudio-react";

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

export const RaycastAnimatedBackground = () => {
  const { width, height } = useWindowSize();

  return (
    <div className={cn("absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[-1]")}>
        <UnicornScene 
          production={true} 
          projectId="cbmTT38A0CcuYxeiyj5H" 
          width={width} 
          height={height} 
        />
    </div>
  );
};