import { Loader2 } from "lucide-react";

const FullScreenLoader = () => {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-60 flex items-center justify-center z-50">
      <Loader2 className="w-10 h-10 text-[#6a38c2] animate-spin" />
    </div>
  );
};

export default FullScreenLoader;
