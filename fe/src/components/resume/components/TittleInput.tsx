import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Pencil } from "lucide-react";
import { useState } from "react";

interface TittleInputProps {
  title: string;
  setTitle: (title: string) => void;
}

const TittleInput = ({ title, setTitle }: TittleInputProps) => {
  const [showInput, setShowInput] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setShowInput(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      {showInput ? (
        <>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            className="text-sm md:text-[17px] bg-transparent outline-none text-black font-semibold border-b border-gray-300 pb-1"
            placeholder="Resume title"
          />

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowInput(false)}
            className="hover:bg-purple-100 transition-all cursor-pointer"
          >
            <Check className="text-[16px] text-purple-600 hover:scale-110 transition-transform" />
          </Button>
        </>
      ) : (
        <>
          <h2 className="text-sm md:text-[17px] font-semibold">{title}</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowInput(true)}
            className="hover:bg-purple-100 transition-all cursor-pointer"
          >
            <Pencil className="text-sm text-purple-600 hover:scale-110 transition-transform" />
          </Button>
        </>
      )}
    </div>
  );
};

export default TittleInput;
