import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CirclePlus, Trash2 } from "lucide-react";

interface Education {
  degree: string;
  institution: string;
  startDate: string;
  endDate: string;
}

interface EducationDetailsFormProps {
  educationInfo: Education[];
  updateArrayItem: (
    index: number,
    field: keyof Education,
    value: string
  ) => void;
  addArrayItem: (item: Education) => void;
  removeArrayItem: (index: number) => void;
}

const EducationDetailsForm = ({
  educationInfo,
  updateArrayItem,
  addArrayItem,
  removeArrayItem,
}: EducationDetailsFormProps) => {
  return (
    <div className="px-5 pt-6">
      <h2 className="text-lg font-bold text-slate-800 mb-4">Học vấn</h2>

      <div className="flex flex-col gap-6">
        {educationInfo.map((education, index) => (
          <div
            key={index}
            className="relative border border-slate-200 rounded-2xl p-6 shadow-sm bg-white"
          >
            {/* Trash Icon */}
            {educationInfo.length > 1 && (
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
                  Bằng cấp
                </Label>
                <Input
                  value={education.degree || ""}
                  onChange={(e) =>
                    updateArrayItem(index, "degree", e.target.value)
                  }
                  type="text"
                  placeholder="B.Sc Computer Science"
                  className="mt-1 w-full rounded-md border border-gray-300 bg-gray-50 px-4 py-2 text-sm text-gray-800"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-slate-700">
                  Đại học / Cao đẳng
                </Label>
                <Input
                  value={education.institution || ""}
                  onChange={(e) =>
                    updateArrayItem(index, "institution", e.target.value)
                  }
                  type="text"
                  placeholder="ABC College/University"
                  className="mt-1 w-full rounded-md border border-gray-300 bg-gray-50 px-4 py-2 text-sm text-gray-800"
                />
              </div>

              <div className="">
                <Label className="text-sm font-medium text-slate-700">
                  Bắt đầu
                </Label>
                <input
                  value={education.startDate || ""}
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
                  value={education.endDate || ""}
                  onChange={(e) =>
                    updateArrayItem(index, "endDate", e.target.value)
                  }
                  type="month"
                  className="mt-1 w-full rounded-md border border-gray-300 bg-gray-50 px-4 py-2 text-sm text-gray-800"
                />
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
              degree: "",
              institution: "",
              startDate: "",
              endDate: "",
            })
          }
        >
          <CirclePlus className="size-4" />
          Thêm học vấn
        </Button>
      </div>
    </div>
  );
};

export default EducationDetailsForm;
