import { useState, useRef, useEffect } from "react";
import { Indicator } from "../types/indicator";
import plantImage from "@/assets/images/plano-bg-gray.png";
import { getGetIndicatorsByCategoryWithHistoryQueryKey, useUpdateIndicator } from "@/api/generated/indicators";
import { queryClient } from "@/lib/queryClient";
import { indicatorToUpdateReq } from "../types/adapters";

interface PlantMapProps {
  indicators?: Indicator[];
  categoryId?: number; 
}

export default function PlantMap({ indicators: indicatorsProp = [], categoryId }: PlantMapProps) {
  const [indicators, setIndicators] = useState<Indicator[]>(indicatorsProp);
  const [selectedIndicator, setSelectedIndicator] = useState<Indicator | null>(null);
  const [originalPosition, setOriginalPosition] = useState<{ x: number; y: number } | null>(null);
  const holdIntervalRef = useRef<number | null>(null);

  const statusColors: Record<number, string> = {
    1: "bg-yellow-500",
    2: "bg-red-500",
    3: "bg-green-500",
    0: "bg-gray-400",
  };

  useEffect(() => {
    setIndicators(indicatorsProp);
  }, [indicatorsProp]);

  const updateMutation = useUpdateIndicator({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getGetIndicatorsByCategoryWithHistoryQueryKey(categoryId??0),
        });
      },
    },
  });


  const handleIndicatorClick = (indicator: Indicator) => {
    setSelectedIndicator({ ...indicator });
    setOriginalPosition({ x: indicator.xLocation, y: indicator.yLocation });
  };

  const moveIndicatorOnce = (direction: "up" | "down" | "left" | "right") => {
    if (!selectedIndicator) return;
    const STEP = 2;
    let { xLocation, yLocation } = selectedIndicator;

    switch (direction) {
      case "up":
        yLocation -= STEP;
        break;
      case "down":
        yLocation += STEP;
        break;
      case "left":
        xLocation -= STEP;
        break;
      case "right":
        xLocation += STEP;
        break;
    }

    const clampedX = Math.max(0, Math.min(100, xLocation));
    const clampedY = Math.max(0, Math.min(100, yLocation));
    const updatedSelected = { ...selectedIndicator, xLocation: clampedX, yLocation: clampedY };
    setSelectedIndicator(updatedSelected);

    setIndicators((prev) =>
      prev.map((ind) =>
        ind.id === updatedSelected.id ? { ...ind, xLocation: clampedX, yLocation: clampedY } : ind
      )
    );
  };

  const handlePressDown = (direction: "up" | "down" | "left" | "right") => {
    moveIndicatorOnce(direction);
    const intervalId = window.setInterval(() => {
      moveIndicatorOnce(direction);
    }, 150);
    holdIntervalRef.current = intervalId;
  };

  const handlePressUp = () => {
    if (holdIntervalRef.current !== null) {
      clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
  };

  const handleSaveLocation = () => {

    updateMutation.mutate({
      id: selectedIndicator!.id,
      data: indicatorToUpdateReq(selectedIndicator!),
    });

    setSelectedIndicator(null);
    setOriginalPosition(null);
  };

  const handleCloseModal = () => {
    if (selectedIndicator && originalPosition) {
      const { x, y } = originalPosition;
      setIndicators((prev) =>
        prev.map((ind) =>
          ind.id === selectedIndicator.id ? { ...ind, xLocation: x, yLocation: y } : ind
        )
      );
    }
    setSelectedIndicator(null);
    setOriginalPosition(null);
  };

  
  return (
    <div className="relative w-full max-w-4xl mx-auto bg-gray-800 rounded-lg overflow-hidden shadow-lg">
      <img src={plantImage} alt="Mapa de la Planta" className="w-full h-auto" />

      {indicators.map((indicator) => (
        <div
          key={indicator.id}
          className={`absolute w-5 h-5 rounded-full border-2 border-white cursor-pointer ${statusColors[indicator.status.id] || "bg-gray-400"}
            }`}
          style={{
            left: `${indicator.xLocation}%`,
            top: `${indicator.yLocation}%`,
            transform: "translate(-50%, -50%)",
          }}
          onClick={() => handleIndicatorClick(indicator)}
          title={indicator.name}
        />
      ))}

      {selectedIndicator && (
        <div className="absolute top-90 -left-155 inset-0 z-50 flex items-center justify-center">
          <div className="bg-gray-100 bg-opacity-75 w-64 rounded-md shadow-lg p-4 relative backdrop-blur-sm">

            <div className="flex flex-col items-center space-y-2">
              <button
                onMouseDown={() => handlePressDown("up")}
                onMouseUp={handlePressUp}
                onMouseLeave={handlePressUp}
                className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 select-none"
              >
                ↑
              </button>
              <div className="flex items-center space-x-2">
                <button
                  onMouseDown={() => handlePressDown("left")}
                  onMouseUp={handlePressUp}
                  onMouseLeave={handlePressUp}
                  className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 select-none"
                >
                  ←
                </button>
                <button
                  onMouseDown={() => handlePressDown("right")}
                  onMouseUp={handlePressUp}
                  onMouseLeave={handlePressUp}
                  className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 select-none"
                >
                  →
                </button>
              </div>
              <button
                onMouseDown={() => handlePressDown("down")}
                onMouseUp={handlePressUp}
                onMouseLeave={handlePressUp}
                className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 select-none"
              >
                ↓
              </button>
            </div>

            <div className="mt-2 flex justify-between">
              <button onClick={handleCloseModal} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded text-sm">
              Cancelar
              </button>
              <button onClick={handleSaveLocation} className="bg-gray-600 hover:bg-gray-500 text-white px-3 py-1 rounded text-sm">
              Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
