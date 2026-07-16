import { Resume } from "@/types/resume";
import { useEffect, useRef, useState } from "react";
import {
  DUMMY_RESUME_DATA,
  resumeTemplates,
  themeColorPalette,
} from "../utils/data";
import Tabs from "../components/Tabs";
import { Button } from "@/components/ui/button";
import { LuCircleCheckBig } from "react-icons/lu";
import TemplateCard from "../Cards/TemplateCard";
import RenderResume from "../ResumeTemplates/RenderResume";

const TAB_DATA = [{ label: "Bản mẫu" }, { label: "Bảng màu" }];

interface ThemeSelectorProps {
  selectorTheme: {
    theme?: string;
    colorPalette?: string[];
  };
  setSelectorTheme: (value: {
    theme?: string;
    colorPalette?: string[];
  }) => void;
  resumeData: Resume | null;
  onClose: () => void;
}

const ThemeSelector = ({
  selectorTheme,
  setSelectorTheme,
  resumeData,
  onClose,
}: ThemeSelectorProps) => {
  const resumeRef = useRef<HTMLDivElement>(null);
  const [baseWith, setBaseWith] = useState(800);

  const [tabValue, setTabValue] = useState("Bản mẫu");

  // Tìm index của bản mẫu đang được chọn (nếu có), mặc định là 0
  const initialTemplateIndex = resumeTemplates.findIndex(
    (t) => t.id === selectorTheme?.theme
  );
  const [selectedTemplate, setSelectedTemplate] = useState({
    theme: selectorTheme?.theme || resumeTemplates[0].id,
    index: initialTemplateIndex !== -1 ? initialTemplateIndex : 0,
  });

  // Tìm index của bảng màu đang được chọn
  const initialColorIndex = themeColorPalette.themeOne.findIndex(
    (c) => JSON.stringify(c) === JSON.stringify(selectorTheme?.colorPalette)
  );
  const [selectedColorPalette, setSelectedColorPalette] = useState({
    colors:
      selectorTheme?.colorPalette && selectorTheme.colorPalette.length > 0
        ? selectorTheme.colorPalette
        : themeColorPalette.themeOne[0],
    index: initialColorIndex !== -1 ? initialColorIndex : 0,
  });

  // Xử lý khi nhấn nút Hoàn thành
  const handleThemeSelection = () => {
    setSelectorTheme({
      colorPalette: selectedColorPalette?.colors,
      theme: selectedTemplate?.theme,
    });
    onClose();
  };

  const updateBaseWidth = () => {
    if (resumeRef.current) {
      setBaseWith(resumeRef.current.offsetWidth);
    }
  };

  useEffect(() => {
    updateBaseWidth();
    window.addEventListener("resize", updateBaseWidth);
    return () => window.removeEventListener("resize", updateBaseWidth);
  }, []);

  return (
    <div className="w-full h-full flex flex-col px-2 md:px-5 mx-auto">
      {/* Header Controls */}
      <div className="flex items-center justify-between mb-4 mt-2 flex-shrink-0">
        <Tabs tabs={TAB_DATA} activeTab={tabValue} setActiveTab={setTabValue} />

        <Button
          className="bg-[#eed8fc] text-[#5e2e82] cursor-pointer hover:bg-[#e3c3fa] hover:shadow-md transition h-9 px-3 md:px-4"
          onClick={() => handleThemeSelection()}
        >
          <LuCircleCheckBig className="text-[16px] md:mr-1" />
          <span className="hidden sm:inline">Hoàn thành</span>
          <span className="sm:hidden ml-1">Xong</span>
        </Button>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-5 flex-1 min-h-0">
        
        {/* Left/Top: Selector (Trượt ngang trên mobile, Grid dọc trên PC) */}
        <div className="col-span-1 md:col-span-5 bg-white min-w-0 flex flex-col">
          <div className="flex md:grid md:grid-cols-2 gap-4 overflow-x-auto md:overflow-y-auto max-h-[25vh] md:max-h-[75vh] pb-2 md:pb-0 pr-1 md:pr-3 snap-x custom-scrollbar">
            {tabValue === "Bản mẫu" &&
              resumeTemplates.map((template, index) => (
                <div 
                  key={`template_${index}`} 
                  className="w-[130px] md:w-auto flex-shrink-0 snap-start"
                >
                  <TemplateCard
                    thumbnailImg={template.thumbnailImg}
                    isSelected={selectedTemplate?.index === index}
                    onSelect={() =>
                      setSelectedTemplate({ theme: template.id, index })
                    }
                  />
                </div>
              ))}

            {tabValue === "Bảng màu" &&
              themeColorPalette.themeOne.map((colors, index) => (
                <div 
                  key={`color_palette_${index}`} 
                  className="w-[140px] md:w-auto flex-shrink-0 snap-start"
                >
                  <ColorPalette
                    colors={colors}
                    isSelected={selectedColorPalette?.index === index}
                    onSelect={() => setSelectedColorPalette({ colors, index })}
                  />
                </div>
              ))}
          </div>
        </div>

        {/* Right/Bottom: Live Preview */}
        <div
          className="col-span-1 md:col-span-7 bg-gray-50/50 rounded-xl border border-gray-200 overflow-y-auto max-h-[55vh] md:max-h-[75vh] min-w-0 custom-scrollbar shadow-inner"
          ref={resumeRef}
        >
          <div className="p-2 md:p-0 pointer-events-none md:pointer-events-auto origin-top transition-transform">
            <RenderResume
              templateId={selectedTemplate?.theme || ""}
              resumeData={resumeData || DUMMY_RESUME_DATA}
              colorPalette={selectedColorPalette?.colors || []}
              containerWidth={baseWith}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeSelector;

interface ColorPaletteProps {
  colors: string[];
  isSelected: boolean;
  onSelect: () => void;
}

const ColorPalette = ({ colors, isSelected, onSelect }: ColorPaletteProps) => {
  return (
    <div
      className={`h-24 md:h-28 rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
        isSelected
          ? "border-purple-500 shadow-md scale-[1.02]"
          : "border-gray-200 hover:border-purple-300"
      }`}
      onClick={onSelect}
    >
      <div className="flex h-full w-full">
        {colors.map((color, index) => (
          <div
            key={`color_${index}`}
            className="flex-1"
            style={{ backgroundColor: color }}
          ></div>
        ))}
      </div>
    </div>
  );
};