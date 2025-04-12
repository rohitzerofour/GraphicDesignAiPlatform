import { fabric } from "fabric";
import { useEffect } from "react";

interface useCanvasEventsProps {
  canvas: fabric.Canvas | null;
  setSelectedObjects: (objects: fabric.Object[]) => void;
  clearSelectionCallback?: () => void;
}

export const useCanvasEvents = ({
  canvas,
  setSelectedObjects,
  clearSelectionCallback,
}: useCanvasEventsProps) => {
  useEffect(() => {
    if (!canvas) return;

    const handleObjectSelected = (e: fabric.IEvent) => {
      setSelectedObjects(e.selected || []);
    };

    const handleSelectionCleared = () => {
      setSelectedObjects([]);
      clearSelectionCallback?.();
    };

    canvas.on("selection:created", handleObjectSelected);
    canvas.on("selection:updated", handleObjectSelected);
    canvas.on("selection:cleared", handleSelectionCleared);

    return () => {
      canvas.off("selection:created", handleObjectSelected);
      canvas.off("selection:updated", handleObjectSelected);
      canvas.off("selection:cleared", handleSelectionCleared);
    };
  }, [canvas, setSelectedObjects, clearSelectionCallback]);
};
