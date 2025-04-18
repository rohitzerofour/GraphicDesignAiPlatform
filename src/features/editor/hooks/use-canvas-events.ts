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

    const handleObjectAdded = () => save();
    const handleObjectModified = () => save();
    const handleObjectRemoved = () => save();
    const handleTextChanged = () => save();

    const handleObjectSelected = (e: fabric.IEvent) => {
      setSelectedObjects(e.selected || []);
    };

    const handleSelectionCleared = () => {
      setSelectedObjects([]);
      clearSelectionCallback?.();
    };

    canvas.on("object:added", handleObjectAdded);
    canvas.on("object:modified", handleObjectModified);
    canvas.on("object:removed", handleObjectRemoved);
    canvas.on("text:changed", handleTextChanged);
    canvas.on("selection:created", handleObjectSelected);
    canvas.on("selection:updated", handleObjectSelected);
    canvas.on("selection:cleared", handleSelectionCleared);

    return () => {
      canvas.off("object:added", handleObjectAdded);
      canvas.off("object:modified", handleObjectModified);
      canvas.off("object:removed", handleObjectRemoved);
      canvas.off("text:changed", handleTextChanged);
      canvas.off("selection:created", handleObjectSelected);
      canvas.off("selection:updated", handleObjectSelected);
      canvas.off("selection:cleared", handleSelectionCleared);
    };
  }, [save, canvas, setSelectedObjects, clearSelectionCallback]);
};
