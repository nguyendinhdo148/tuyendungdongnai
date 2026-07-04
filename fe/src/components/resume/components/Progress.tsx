interface ProgressProps {
  progress: number;
  total: number;
  color: string;
  bgColor: string;
}

const Progress = ({
  progress = 0,
  total,
  color,
  bgColor,
}: ProgressProps) => {
  return (
    <div className="flex gap-1.5">
      {[...Array(total)].map((_, index) => (
        <div
          key={index}
          className={`size-2 rounded-2xl transition-all ${
            index < progress ? "bg-cyan-500" : "bg-cyan-100"
          }`}
          style={{
            backgroundColor:
              index < progress
                ? color || "rgba(1,1,1,1)"
                : bgColor || "rgba(1,1,1,0.1)",
          }}
        ></div>
      ))}
    </div>
  );
};

export default Progress;
