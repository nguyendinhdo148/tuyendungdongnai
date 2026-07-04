interface TemplateCardProps {
  thumbnailImg: string;
  isSelected: boolean;
  onSelect: () => void;
}

const TemplateCard = ({
  thumbnailImg,
  isSelected,
  onSelect,
}: TemplateCardProps) => {
  return (
    <div
      className={`h-auto md:h-[360px] flex flex-col items-center justify-between bg-white rounded-lg border border-gray-200 hover:border-purple-300 overflow-hidden cursor-pointer
      ${isSelected ? "border-purple-500" : ""}
      `}
      onClick={onSelect}
    >
      {thumbnailImg ? (
        <img
          src={thumbnailImg}
          alt="Template thumbnail"
          className="w-[100%] rounded-lg"
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default TemplateCard;
