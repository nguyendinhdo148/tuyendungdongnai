import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CirclePlus, Trash2 } from "lucide-react";
import RatingInput from "../../ResumeSections/RatingInput";

interface Skills {
  name: string;
  progress: number;
}

interface SkillsInfoFormProps {
  skillsInfo: Skills[];
  updateArrayItem: (
    index: number,
    field: keyof Skills,
    value: string | number
  ) => void;
  addArrayItem: (item: Skills) => void;
  removeArrayItem: (index: number) => void;
}

const SkillsInfoForm = ({
  skillsInfo,
  updateArrayItem,
  addArrayItem,
  removeArrayItem,
}: SkillsInfoFormProps) => {
  return (
    <div className="px-5 pt-6">
      <h2 className="text-lg font-bold text-slate-800 mb-4">Kỹ năng của bạn</h2>

      <div className="flex flex-col gap-6">
        {skillsInfo.map((skill, index) => (
          <div
            key={index}
            className="relative border border-slate-200 rounded-2xl p-6 shadow-sm bg-white"
          >
            {/* Trash Icon */}
            {skillsInfo.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-1.5 right-3 text-red-600 hover:bg-red-100 cursor-pointer"
                onClick={() => removeArrayItem(index)}
              >
                <Trash2 className="size-4" />
              </Button>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <Label className="text-sm font-medium text-slate-700">
                  Kỹ năng
                </Label>
                <Input
                  type="text"
                  value={skill.name}
                  onChange={(e) =>
                    updateArrayItem(index, "name", e.target.value)
                  }
                  placeholder="React, NodeJS,..."
                  className="mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex flex-col">
                <Label className="text-sm font-medium text-gray-700">
                  Mức độ thành thạo ({skill.progress / 20 || 0}/5)
                </Label>
                <div className="mt-5">
                  <RatingInput
                    value={skill.progress || 0}
                    total={5}
                    onChange={(newValue) =>
                      updateArrayItem(index, "progress", newValue)
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Add Button */}
        <Button
          type="button"
          className="self-start cursor-pointer flex items-center gap-2 px-4 py-2 rounded-md bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 transition"
          onClick={() =>
            addArrayItem({
              name: "",
              progress: 0,
            })
          }
        >
          <CirclePlus className="size-4" />
          Thêm kỹ năng
        </Button>
      </div>
    </div>
  );
};

export default SkillsInfoForm;
