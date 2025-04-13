import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus } from "lucide-react";

interface FontSizeInputProps {
  value: number;
  onChange: (value: number) => void;
}

export const FontSizeInput = ({ value, onChange }: FontSizeInputProps) => {
  const increment = () => onChange(value + 1);
  const decrement = () => onChange(value - 1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    if (!isNaN(newValue)) {
      onChange(newValue);
    }
  };

  return (
    <div className="flex items-center">
      <Hint label="Decrease font size" side="bottom" sideOffset={5}>
        <Button
          onClick={decrement}
          variant="outline"
          size="icon"
          className="p-2 rounded-r-none border-r-0"
        >
          <Minus className="size-4" />
        </Button>
      </Hint>
      <Input
        onChange={handleChange}
        value={value}
        className="w-[50px] h-8 focus-visible:ring-offset-0 focus-visible:ring-0 rounded-none"
      />
      <Hint label="Increase font size" side="bottom" sideOffset={5}>
        <Button
          onClick={increment}
          variant="outline"
          size="icon"
          className="p-2 rounded-l-none border-l-0"
        >
          <Plus className="size-4" />
        </Button>
      </Hint>
    </div>
  );
};
