import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@radix-ui/react-label";
import { CirclePlus, Trash2 } from "lucide-react";

interface Project {
  title: string;
  description: string;
  github: string;
  liveDemo: string;
}
interface ProjectsDetailsFormProps {
  projectInfo: Project[];
  updateArrayItem: (index: number, field: keyof Project, value: string) => void;
  addArrayItem: (item: Project) => void;
  removeArrayItem: (index: number) => void;
}

const ProjectsDetailsForm = ({
  projectInfo,
  updateArrayItem,
  addArrayItem,
  removeArrayItem,
}: ProjectsDetailsFormProps) => {
  return (
    <div className="px-5 pt-6">
      <h2 className="text-lg font-bold text-slate-800 mb-4">Dự án</h2>

      <div className="flex flex-col gap-6">
        {projectInfo.map((project, index) => (
          <div
            key={index}
            className="relative border border-slate-200 rounded-2xl p-6 shadow-sm bg-white"
          >
            {/* Trash Icon */}
            {projectInfo.length > 1 && (
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
              <div className="col-span-2">
                <Label className="text-sm font-medium text-slate-700">
                  Tên dự án
                </Label>
                <Input
                  value={project.title || ""}
                  onChange={(e) =>
                    updateArrayItem(index, "title", e.target.value)
                  }
                  type="text"
                  placeholder="Portfolio Website"
                  className="mt-1 w-full rounded-md border border-gray-300 bg-gray-50 px-4 py-2 text-sm text-gray-800"
                />
              </div>

              <div className="col-span-2">
                <Label className="text-sm font-medium text-slate-700">
                  Mô tả
                </Label>
                <Textarea
                  value={project.description || ""}
                  rows={4}
                  className="mt-1 w-full rounded-md border border-gray-300 bg-gray-50 px-4 py-2 text-sm text-gray-800"
                  placeholder="Description about the project..."
                  onChange={(e) =>
                    updateArrayItem(index, "description", e.target.value)
                  }
                />
              </div>

              <div className="md:col-span-2">
                <Label className="text-sm font-medium text-slate-700">
                  Github Link
                </Label>
                <input
                  value={project.github || ""}
                  onChange={(e) =>
                    updateArrayItem(index, "github", e.target.value)
                  }
                  placeholder="https://github.com/username/project"
                  type="text"
                  className="mt-1 w-full rounded-md border border-gray-300 bg-gray-50 px-4 py-2 text-sm text-gray-800"
                />
              </div>

              <div className="md:col-span-2">
                <Label className="text-sm font-medium text-slate-700">
                  Live Demo URL
                </Label>
                <input
                  value={project.liveDemo || ""}
                  onChange={(e) =>
                    updateArrayItem(index, "liveDemo", e.target.value)
                  }
                  placeholder="https://your-project-url.com"
                  type="text"
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
              title: "",
              description: "",
              github: "",
              liveDemo: "",
            })
          }
        >
          <CirclePlus className="size-4" />
          Thêm dự án
        </Button>
      </div>
    </div>
  );
};

export default ProjectsDetailsForm;
