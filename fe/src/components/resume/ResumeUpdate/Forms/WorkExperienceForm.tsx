import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CirclePlus, Trash2 } from "lucide-react";

interface WorkExperience {
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface WorkExperienceFormProps {
  workExperience: WorkExperience[];
  updateArrayItem: (
    index: number,
    field: keyof WorkExperience,
    value: string
  ) => void;
  addArrayItem: (item: WorkExperience) => void;
  removeArrayItem: (index: number) => void;
}

const WorkExperienceForm = ({
  workExperience,
  updateArrayItem,
  addArrayItem,
  removeArrayItem,
}: WorkExperienceFormProps) => {
  return (
    <div className="px-5 pt-6">
      <h2 className="text-lg font-bold text-slate-800 mb-4">Kinh nghiệm làm việc</h2>

      <div className="flex flex-col gap-6">
        {workExperience.map((experience, index) => (
          <div
            key={index}
            className="relative border border-slate-200 rounded-2xl p-6 shadow-sm bg-white"
          >
            {/* Trash Icon */}
            {workExperience.length > 1 && (
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

            {/* Form Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <Label className="text-sm font-medium text-slate-700">
                  Công ty
                </Label>
                <Input
                  value={experience.company || ""}
                  onChange={(e) =>
                    updateArrayItem(index, "company", e.target.value)
                  }
                  type="text"
                  placeholder="ABC Corporation"
                  className="mt-1 w-full rounded-md border border-gray-300 bg-gray-50 px-4 py-2 text-sm text-gray-800"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-slate-700">
                  Vị trí
                </Label>
                <Input
                  value={experience.role || ""}
                  onChange={(e) =>
                    updateArrayItem(index, "role", e.target.value)
                  }
                  type="text"
                  placeholder="Frontend Developer"
                  className="mt-1 w-full rounded-md border border-gray-300 bg-gray-50 px-4 py-2 text-sm text-gray-800"
                />
              </div>

              <div className="">
                <Label className="text-sm font-medium text-slate-700">
                  Bắt đầu
                </Label>
                <input
                  value={experience.startDate || ""}
                  onChange={(e) =>
                    updateArrayItem(index, "startDate", e.target.value)
                  }
                  type="month"
                  className="mt-1 w-full rounded-md border border-gray-300 bg-gray-50 px-4 py-2 text-sm text-gray-800"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-slate-700">
                  Kết thúc
                </Label>
                <input
                  value={experience.endDate || ""}
                  onChange={(e) =>
                    updateArrayItem(index, "endDate", e.target.value)
                  }
                  type="month"
                  className="mt-1 w-full rounded-md border border-gray-300 bg-gray-50 px-4 py-2 text-sm text-gray-800"
                />
              </div>
            </div>

            {/* Description */}
            <div className="mt-5">
              <Label className="text-sm font-medium text-slate-700">
                Mô tả kinh nghiệm làm việc của bạn
              </Label>
              <Textarea
                value={experience.description || ""}
                rows={4}
                className="mt-1 w-full rounded-md border border-gray-300 bg-gray-50 px-4 py-2 text-sm text-gray-800"
                placeholder="Describe your responsibilities and achievements..."
                onChange={(e) =>
                  updateArrayItem(index, "description", e.target.value)
                }
              />
            </div>
          </div>
        ))}

        {/* Add Button */}
        <Button
          type="button"
          className="self-start cursor-pointer flex items-center gap-2 px-4 py-2 rounded-md bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 transition"
          onClick={() =>
            addArrayItem({
              company: "",
              role: "",
              startDate: "",
              endDate: "",
              description: "",
            })
          }
        >
          <CirclePlus className="size-4" />
          Thêm kinh nghiệm làm việc
        </Button>
      </div>
    </div>
  );
};

export default WorkExperienceForm;
