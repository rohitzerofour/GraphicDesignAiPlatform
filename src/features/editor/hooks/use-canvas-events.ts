import { fabric } from "fabric";
import { useEffect } from "react";

interface useCanvasEventsProps {
  save: () => void;
  canvas: fabric.Canvas | null;
  setSelectedObjects: (objects: fabric.Object[]) => void;
  clearSelectionCallback?: () => void;
}

export const useCanvasEvents = ({
  save,
  canvas,
  setSelectedObjects,
  clearSelectionCallback,
}: useCanvasEventsProps) => {
  useEffect(() => {
    if (!canvas) return;

    canvas.on("object:added", () => save());
    canvas.on("object:modified", () => save());
    canvas.on("object:removed", () => save());

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
      canvas.off("object:added", () => save());
      canvas.off("object:modified", () => save());
      canvas.off("object:removed", () => save());
      canvas.off("selection:created", handleObjectSelected);
      canvas.off("selection:updated", handleObjectSelected);
      canvas.off("selection:cleared", handleSelectionCleared);
    };
  }, [save, canvas, setSelectedObjects, clearSelectionCallback]);
};
