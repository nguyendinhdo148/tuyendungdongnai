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
  const [selectedColorPalette, setSelectedColorPalette] = useState({
    colors: selectorTheme?.colorPalette,
    index: -1,
  });
  const [selectedTemplate, setSelectedTemplate] = useState({
    theme: selectorTheme?.theme || "",
    index: -1,
  });

  // handle theme change
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
    <div className="w-full px-5 mx-auto">
      <div className="flex items-center justify-between mb-5 mt-2">
        <Tabs tabs={TAB_DATA} activeTab={tabValue} setActiveTab={setTabValue} />

        <Button
          className="bg-[#eed8fc] text-[#5e2e82] cursor-pointer hover:bg-[#e3c3fa] hover:shadow-md transition"
          onClick={() => handleThemeSelection()}
        >
          <LuCircleCheckBig className="text-16px" /> Hoàn thành
        </Button>
      </div>

      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 md:col-span-5 bg-white min-w-0 overflow-hidden">
          <div className="grid grid-cols-2 gap-5 max-h-[100vh] overflow-y-auto pr-3 custom-scrollbar">
            {tabValue === "Bản mẫu" &&
              resumeTemplates.map((template, index) => (
                <TemplateCard
                  key={`template_${index}`}
                  thumbnailImg={template.thumbnailImg}
                  isSelected={selectedTemplate?.index === index}
                  onSelect={() =>
                    setSelectedTemplate({ theme: template.id, index })
                  }
                />
              ))}

            {tabValue === "Bảng màu" &&
              themeColorPalette.themeOne.map((colors, index) => (
                <ColorPalette
                  key={`color_palette_${index}`}
                  colors={colors}
                  isSelected={selectedColorPalette?.index === index}
                  onSelect={() => setSelectedColorPalette({ colors, index })}
                />
              ))}
          </div>
        </div>

        <div
          className="col-span-12 md:col-span-7 bg-white -mt-3 min-w-0" //overflow-hidden
          ref={resumeRef}
        >
          <RenderResume
            templateId={selectedTemplate?.theme || ""}
            resumeData={resumeData || DUMMY_RESUME_DATA}
            colorPalette={selectedColorPalette?.colors || []}
            containerWidth={baseWith}
          />
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
      className={`h-28 rounded-lg overflow-hidden border-2 cursor-pointer ${
        isSelected ? "border-purple-500" : "border-gray-200"
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
