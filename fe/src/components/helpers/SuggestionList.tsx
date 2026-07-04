import React from "react";

const highlightText = (text: string, keyword: string) => {
  const parts = text.split(new RegExp(`(${keyword})`, "gi"));
  return parts.map((part, i) =>
    part.toLowerCase() === keyword.toLowerCase() ? (
      <mark key={i} className="bg-yellow-200">
        {part}
      </mark>
    ) : (
      <span key={i}>{part}</span>
    )
  );
};

type SuggestionItem = {
  id: string | number;
  title: string;
  location: string;
  company?: {
    name?: string;
  };
};

interface SuggestionListProps {
  suggestions: SuggestionItem[];
  onSelect: (item: SuggestionItem) => void;
  keyword: string;
  activeIndex: number;
}

const SuggestionList: React.FC<SuggestionListProps> = ({
  suggestions,
  onSelect,
  keyword,
  activeIndex,
}) => {
  if (!suggestions.length) return null;

  return (
    <ul className="absolute z-10 w-full bg-white border border-gray-200 mt-2 rounded-md shadow-lg text-left max-h-64 overflow-y-auto">
      {suggestions.map((item, index) => (
        <li
          key={item.id}
          onClick={() => onSelect(item)}
          className={`px-4 py-2 cursor-pointer ${
            index === activeIndex ? "bg-gray-100" : ""
          }`}
        >
          <div className="font-medium">
            {highlightText(item.title, keyword)}
          </div>
          <div className="text-sm text-gray-500">
            {highlightText(item.company?.name || "", keyword)} -{" "}
            {highlightText(item.location, keyword)}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default SuggestionList;
