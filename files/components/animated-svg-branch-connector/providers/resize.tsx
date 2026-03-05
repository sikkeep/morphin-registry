"use client";

import { parse } from "next-useragent";
import {
  createContext,
  useContext,
  useMemo,
  PropsWithChildren,
  useState,
  useEffect,
} from "react";
import { useMediaQuery } from "usehooks-ts";

function getResizeMode(uaString?: string) {
  const ua = parse(
    uaString ||
      (typeof window !== "undefined" ? window?.navigator?.userAgent : ""),
  );

  if (ua.isDesktop) {
    return "xl";
  }

  return "md";
}

type ResizeModeType = "sm" | "md" | "lg" | "xl" | "xxl";

export const downSizes = {
  downSm: ["sm"],
  downMd: ["sm", "md"],
  downLg: ["sm", "md", "lg"],
  downXl: ["sm", "md", "lg", "xl"],
};

type ResizeModeContextType = {
  resizeMode: ResizeModeType;
  isMobile: boolean;
  isDesktop: boolean;
  isXlDesktop: boolean;
};

const ResizeModeContext = createContext<ResizeModeContextType>({
  resizeMode: "xl",
  isMobile: false,
  isDesktop: true,
  isXlDesktop: false,
});

ResizeModeContext.displayName = "ResizeModeContext";

function ResizeProvider({
  children,
  uaString,
}: PropsWithChildren & {
  uaString: string;
}) {
  const [resizeMode, setResizeMode] = useState<ResizeModeType>(
    getResizeMode(uaString),
  );

  const isSmScreen = useMediaQuery("(max-width: 767px)");
  const isMdScreen = useMediaQuery("(max-width: 1023px)");
  const isLgScreen = useMediaQuery("(max-width: 1280px)");
  const isXlScreen = useMediaQuery("(max-width: 1440px)");
  const isXXlScreen = useMediaQuery("(min-width: 1441px)");

  useEffect(() => {
    if (isSmScreen) {
      setResizeMode("sm");
    } else if (isMdScreen) {
      setResizeMode("md");
    } else if (isLgScreen) {
      setResizeMode("lg");
    } else if (isXlScreen) {
      setResizeMode("xl");
    } else if (isXXlScreen) {
      setResizeMode("xxl");
    }
  }, [isLgScreen, isMdScreen, isXlScreen, isSmScreen, isXXlScreen]);

  const isMobile = useMemo(
    () => resizeMode === "sm" || resizeMode === "md",
    [resizeMode],
  );

  const value = useMemo(
    () => ({
      resizeMode,
      isMobile,
      isDesktop: !isMobile,
      isXlDesktop: resizeMode === "xl" || resizeMode === "xxl",
    }),
    [resizeMode, isMobile],
  );

  return (
    <ResizeModeContext.Provider value={value}>
      {children}
    </ResizeModeContext.Provider>
  );
}

export const useResizeMode = () => useContext(ResizeModeContext);

export default ResizeProvider;
