import { Input } from "@/components/ui/input";
import RatingInput from "../../ResumeSections/RatingInput";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CirclePlus, Trash2 } from "lucide-react";

interface Language {
  name: string;
  progress: number;
}

interface AdditionalInfoFormProps {
  languages: Language[];
  interests: string[];
  updateArrayItem: (
    section: "languages" | "interests",
    index: number,
    key: string | null,
    value: string | number
  ) => void;
  addArrayItem: (
    section: "languages" | "interests",
    item: Language | string
  ) => void;
  removeArrayItem: (section: "languages" | "interests", index: number) => void;
}

const AdditionalInfoForm = ({
  languages,
  interests,
  updateArrayItem,
  addArrayItem,
  removeArrayItem,
}: AdditionalInfoFormProps) => {
  return (
    <div className="p-8 bg-white rounded-xl">
      <h2 className="text-lg font-semibold text-gray-900 mb-8">
        Thông tin bổ sung
      </h2>

      {/* Languages Section */}
      <div className="mb-8">
        <h3 className="text-base font-medium text-gray-800 mb-4">Ngoại ngữ</h3>
        <div className="space-y-4">
          {languages.map((language, index) => (
            <div key={index} className="bg-gray-50 px-6 rounded-lg">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <Label className="text-sm text-gray-700 my-2">Ngôn ngữ</Label>
                  <Input
                    value={language.name}
                    onChange={(e) =>
                      updateArrayItem(
                        "languages",
                        index,
                        "name",
                        e.target.value
                      )
                    }
                    placeholder="e.g. English"
                    className="bg-white border-gray-200"
                  />
                </div>

                <div>
                  <Label className="text-sm text-gray-700 my-2">
                    Mức độ thành thạo
                  </Label>
                  <div className="mt-2">
                    <RatingInput
                      value={language.progress || 0}
                      onChange={(value) =>
                        updateArrayItem("languages", index, "progress", value)
                      }
                      total={5}
                      // activeColor="#9333ea" // Purple color
                      // inactiveColor="#f3e8ff"
                    />
                  </div>
                </div>
              </div>

              {languages.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => removeArrayItem("languages", index)}
                  className="mt-2 text-gray-400 hover:text-red-600 cursor-pointer"
                >
                  <Trash2 className="size-4" />
                </Button>
              )}
            </div>
          ))}

          <Button
            type="button"
            variant="ghost"
            onClick={() => addArrayItem("languages", { name: "", progress: 0 })}
            className="flex items-center gap-2 bg-purple-100 text-purple-800 hover:bg-purple-200 mt-2 cursor-pointer"
          >
            <CirclePlus className="size-5" />
            Thêm ngôn ngữ
          </Button>
        </div>
      </div>

      {/* Interests Section */}
      <div>
        <h3 className="text-lg font-medium text-gray-800 mb-4">Sở thích</h3>
        <div className="space-y-3">
          {interests.map((interest, index) => (
            <div key={index} className="relative">
              <Input
                value={interest || ""}
                onChange={(e) =>
                  updateArrayItem("interests", index, null, e.target.value)
                }
                placeholder="e.g. Reading"
                className="bg-gray-50 border-gray-200 pr-10"
              />
              {interests.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeArrayItem("interests", index)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-600 cursor-pointer"
                >
                  <Trash2 className="size-4" />
                </Button>
              )}
            </div>
          ))}

          <Button
            type="button"
            variant="ghost"
            onClick={() => addArrayItem("interests", "")}
            className="flex items-center gap-2 bg-purple-100 text-purple-800 hover:bg-purple-200 mt-2 cursor-pointer"
          >
            <CirclePlus className="size-5" />
            Thêm sở thích
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdditionalInfoForm;
