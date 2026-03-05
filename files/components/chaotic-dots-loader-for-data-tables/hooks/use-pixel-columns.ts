import { useState, useEffect } from "react";

export function usePixelColumns() {
  const [pixelColumns, setPixelColumns] = useState(170);

  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;
      const columns = Math.max(60, Math.floor(170 * (width / 1440)));
      setPixelColumns(columns);
    };

    updateColumns();

    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  return pixelColumns;
}
