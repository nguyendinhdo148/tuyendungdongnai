import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import type { Job } from "@/types/job";
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { setCompanies } from "@/redux/companySlice";
import axios from "axios";
import { API } from "@/utils/constant";
import { Loader2 } from "lucide-react";

export interface JobFormData {
  title: string;
  description: string;
  requirements: string[];
  salary: number;
  benefits: string[];
  location: string;
  jobType: string;
  experienceLevel: number;
  position: number;
  category: string;
  company: {
    _id: string;
    name: string;
  };
  status?: string;
}

interface JobFormDialogProps {
  open: boolean;
  onClose: () => void;
  job: Job | null;
  onSuccess: (data: JobFormData) => Promise<void>;
}

const initialFormData: JobFormData = {
  title: "",
  description: "",
  requirements: [],
  benefits: [],
  salary: 0,
  location: "",
  jobType: "",
  experienceLevel: 0,
  position: 1,
  category: "",
  company: {
    _id: "",
    name: "",
  },
  status: "active",
};

export const JobFormDialog = ({
  open,
  onClose,
  job,
  onSuccess,
}: JobFormDialogProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<JobFormData>(initialFormData);
  const dispatch = useDispatch();

  const { companies } = useSelector((state: RootState) => state.company);

  // Fetch companies
  const fetchCompanies = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/admin/all-companies`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setCompanies(res.data.companies));
      }
    } catch (error) {
      console.error("Fetch companies error:", error);
      toast.error("Không thể tải danh sách công ty!");
    }
  }, [dispatch]);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  useEffect(() => {
    if (!open) {
      setFormData(initialFormData);
      return;
    }
    if (job) {
      setFormData({
        title: job.title,
        description: job.description,
        requirements: job.requirements,
        benefits: job.benefits,
        salary: Number(job.salary) || 0,
        location: job.location,
        jobType: job.jobType,
        experienceLevel: job.experienceLevel,
        position: job.position,
        category: job.category,
        company: {
          _id: job.company?._id || "",
          name: job.company?.name || "",
        },
        status: job.status || "draft",
      });
    } else {
      setFormData(initialFormData);
    }
  }, [job, open]);

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Vui lòng nhập tiêu đề công việc");
      return;
    }
    if (!formData.description.trim()) {
      toast.error("Vui lòng nhập mô tả công việc");
      return;
    }
    if (!formData.location.trim()) {
      toast.error("Vui lòng nhập địa điểm làm việc");
      return;
    }
    if (!formData.company._id) {
      toast.error("Vui lòng chọn công ty");
      return;
    }
    if (formData.salary <= 0) {
      toast.error("Vui lòng nhập mức lương hợp lệ");
      return;
    }
    if (formData.experienceLevel < 0) {
      toast.error("Vui lòng nhập số năm kinh nghiệm hợp lệ");
      return;
    }

    setIsSubmitting(true);

    try {
      await onSuccess({
        ...formData,
        salary: Number(formData.salary),
        requirements: formData.requirements,
        benefits: formData.benefits,
        experienceLevel: Number(formData.experienceLevel),
        position: Number(formData.position),
      });
      onClose();
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("Có lỗi xảy ra khi xử lý form");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate description by AI
  const handleGenDescription = async () => {
    try {
      setIsGenerating(true);
      const res = await axios.post(
        `${API}/ai/generate-description`,
        {
          title: formData.title,
          category: formData.category,
        },
        { withCredentials: true }
      );

      if (res.data.success && res.data.description) {
        setFormData((prev) => ({
          ...prev,
          description: res.data.description,
        }));
        toast.success("Đã tạo mô tả công việc thành công!");
      } else {
        toast.error("Không tạo được mô tả, vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Generate AI error:", error);
      toast.error("Có lỗi khi sử dụng AI!");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] bg-white max-h-[90vh] overflow-y-auto border-none p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200 ease-in-out">
        <DialogHeader>
          <DialogTitle>
            {job ? "Chỉnh sửa tin tuyển dụng" : "Đăng tin tuyển dụng mới"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* --- Thông tin công việc --- */}
          <div className="space-y-4 border p-4 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold">Thông tin công việc</h3>

            <div className="grid gap-2">
              <Label htmlFor="company">
                Công ty <span className="text-red-700">*</span>
              </Label>
              <Select
                value={formData.company._id}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    company: { ...formData.company, _id: value },
                  })
                }
              >
                <SelectTrigger className="cursor-pointer">
                  <SelectValue placeholder="Chọn công ty">
                    {
                      companies.find((c) => c._id === formData.company._id)
                        ?.name
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-white max-h-[300px] overflow-y-auto">
                  {companies.map((company) => (
                    <SelectItem
                      className="cursor-pointer hover:bg-gray-100"
                      key={company._id}
                      value={company._id}
                    >
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="title">
                Tiêu đề công việc <span className="text-red-700">*</span>
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="VD: Senior Frontend Developer"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="location">
                Địa điểm <span className="text-red-700">*</span>
              </Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="VD: Tòa nhà A, Quận 1, Hồ Chí Minh"
                required
              />
            </div>
          </div>

          {/* --- Mô tả & Yêu cầu --- */}
          <div className="space-y-4 border p-4 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold">Mô tả & Yêu cầu công việc</h3>

            <div className="grid gap-2">
              <Label htmlFor="description">
                Mô tả công việc <span className="text-red-700">*</span>
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Mô tả chi tiết về công việc. Mỗi đoạn mô tả đều kết thúc bằng dấu chấm."
                required
                rows={5}
              />

              {/* Gen mô tả bằng AI */}
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="hover:bg-gray-100 cursor-pointer right-2 top-2 text-sm flex gap-2 items-center"
                onClick={handleGenDescription}
                disabled={isGenerating || !formData.title.trim()}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Đang tạo...
                  </>
                ) : (
                  "✨ Dùng AI tạo mô tả"
                )}
              </Button>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="requirements">
                Yêu cầu ứng viên <span className="text-red-700">*</span>
              </Label>
              <Textarea
                id="requirements"
                value={formData.requirements.join("\n")}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    requirements: e.target.value.split("\n").filter(Boolean),
                  })
                }
                placeholder="Mỗi yêu cầu đều kết thúc bằng dấu chấm."
                required
                rows={5}
              />
            </div>
          </div>

          {/* --- Phúc lợi & Thông tin thêm --- */}
          <div className="space-y-4 border p-4 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold">Phúc lợi & Thông tin thêm</h3>

            <div className="grid gap-2">
              <Label htmlFor="benefits">
                Quyền lợi <span className="text-red-700">*</span>
              </Label>
              <Textarea
                id="benefits"
                value={formData.benefits.join("\n")}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    benefits: e.target.value.split("\n").filter(Boolean),
                  })
                }
                placeholder="Mỗi quyền lợi đều kết thúc bằng dấu chấm."
                required
                rows={5}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="jobType">
                Hình thức làm việc <span className="text-red-700">*</span>
              </Label>
              <Select
                value={formData.jobType}
                onValueChange={(value) =>
                  setFormData({ ...formData, jobType: value })
                }
              >
                <SelectTrigger id="jobType" className="cursor-pointer">
                  <SelectValue placeholder="Chọn hình thức" />
                </SelectTrigger>
                <SelectContent className="bg-white max-h-[300px] overflow-y-auto">
                  <SelectItem
                    className="cursor-pointer hover:bg-gray-100"
                    value="Full-Time"
                  >
                    Toàn thời gian
                  </SelectItem>
                  <SelectItem
                    className="cursor-pointer hover:bg-gray-100"
                    value="Part-Time"
                  >
                    Bán thời gian
                  </SelectItem>
                  <SelectItem
                    className="cursor-pointer hover:bg-gray-100"
                    value="Remote"
                  >
                    Từ xa
                  </SelectItem>
                  <SelectItem
                    className="cursor-pointer hover:bg-gray-100"
                    value="Internship"
                  >
                    Thực tập
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="experienceLevel">
                Chuyên ngành <span className="text-red-700">*</span>
              </Label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full border rounded-md px-3 py-2 text-gray-800"
                placeholder="Ví dụ: IT, Kế toán, Marketing..."
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="experienceLevel">
                Kinh nghiệm (năm) <span className="text-red-700">*</span>
              </Label>
              <Input
                id="experienceLevel"
                type="number"
                min="0"
                value={formData.experienceLevel}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    experienceLevel: parseInt(e.target.value) || 0,
                  })
                }
                placeholder="VD: 2"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="salary">
                Mức lương (Triệu) <span className="text-red-700">*</span>
              </Label>
              <Input
                id="salary"
                type="number"
                value={formData.salary}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    salary: parseInt(e.target.value) || 0,
                  })
                }
                placeholder="VD: 15"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="position">
                Số lượng tuyển <span className="text-red-700">*</span>
              </Label>
              <Input
                id="position"
                type="number"
                min="1"
                value={formData.position}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    position: parseInt(e.target.value) || 1,
                  })
                }
                placeholder="VD: 1"
                required
              />
            </div>
          </div>

          {/* --- Trạng thái & Nút --- */}
          <div className="space-y-4 border p-4 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold">Trạng thái & Hành động</h3>

            <div className="grid gap-2">
              <Label htmlFor="status">
                Trạng thái <span className="text-red-700">*</span>
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger id="status" className="cursor-pointer">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent className="bg-white max-h-[300px] overflow-y-auto">
                  <SelectItem
                    className="cursor-pointer hover:bg-gray-100"
                    value="active"
                  >
                    Hoạt động
                  </SelectItem>
                  <SelectItem
                    className="cursor-pointer hover:bg-gray-100"
                    value="draft"
                  >
                    Nháp
                  </SelectItem>
                  <SelectItem
                    className="cursor-pointer hover:bg-gray-100"
                    value="closed"
                  >
                    Đã đóng
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
                className="border-gray-300 text-black hover:bg-gray-100 cursor-pointer"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
              >
                {isSubmitting ? "Đang xử lý..." : job ? "Cập nhật" : "Đăng tin"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
