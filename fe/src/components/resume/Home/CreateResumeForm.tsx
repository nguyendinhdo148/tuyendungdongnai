import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { API } from "@/utils/constant";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CreateResumeFormProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const CreateResumeForm = ({ open, setOpen }: CreateResumeFormProps) => {
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  // handle create resume
  const handleCreateResume = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Vui lòng nhập tiêu đề");
      return;
    }

    setError("");

    // create resume
    try {
      const res = await axios.post(
        `${API}/resume`,
        { title },
        {
          withCredentials: true,
        }
      );
      if (res.data.success) {
        navigate(`/resume/edit/${res.data.newResume._id}`);
      }
    } catch (error) {
      console.log("Error creating resume: ", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px] bg-white border-none p-0">
        <DialogHeader className="px-6 pt-5">
          <DialogTitle className="text-2xl font-bold">
            Tạo CV mới
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 pb-6 flex flex-col gap-4">
          <div>
            <h3 className="text-xl font-medium text-gray-800">
              Tạo sơ yếu lý lịch mới
            </h3>
            <p className="text-lg text-gray-600 mt-1">
              Hãy đặt tiêu đề cho hồ sơ của bạn để bắt đầu. Bạn có thể chỉnh sửa
              tất cả các chi tiết sau.
            </p>
          </div>

          <form onSubmit={handleCreateResume} className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="resume-title" className="text-lg">Tiêu đề hồ sơ</Label>
              <Input
                id="resume-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Eg: Your Resume"
                type="text"
                style={{ boxShadow: "none" }}
              />
              {error && <p className="text-red-500 text-xs">{error}</p>}
            </div>

            <Button
              type="submit"
              className="bg-[#edd8fc] text-[#5e2e82] cursor-pointer hover:bg-[#e3c3fa] hover:shadow-md transition"
            >
              Tạo CV
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateResumeForm;
