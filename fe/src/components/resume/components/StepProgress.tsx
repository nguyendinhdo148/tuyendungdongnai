interface StepProgressProps {
  progress: number;
}
const StepProgress = ({ progress }: StepProgressProps) => {
  return (
    <div className="w-full bg-purple-50 h-1 overflow-hidden rounded-[2px]">
      <div
        className="h-1 bg-linear-to-r from-purple-500/85 to-purple-700 transition-all rounded-sm"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

export default StepProgress;
