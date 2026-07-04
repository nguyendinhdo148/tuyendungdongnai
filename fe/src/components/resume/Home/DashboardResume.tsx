import { API } from "@/utils/constant";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";
import { CirclePlus } from "lucide-react";
import { Resume } from "@/types/resume";
// import moment from "moment";
import ResumeSummaryCard from "../Cards/ResumeSummaryCard";
import CreateResumeForm from "./CreateResumeForm";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import toast from "react-hot-toast";

const DashboardResume = () => {
  const { user } = useSelector((store: RootState) => store.auth);
  const navigate = useNavigate();
  const [openCreateModel, setOpenCreateModel] = useState(false);
  const [allResume, setAllResume] = useState<Resume[]>([]);

  const fetchAllResume = async () => {
    try {
      const res = await axios.get(`${API}/resume`, {
        withCredentials: true,
      });
      setAllResume(res.data);
    } catch (error) {
      console.log("Error fetching resume: ", error);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
      toast.error("Vui lòng đăng nhập để truy cập trang này.");
    } else if (user.role === "recruiter") {
      navigate("/recruiter");
    } else if (user.role === "admin") {
      navigate("/admin");
    }
    fetchAllResume();
  }, [user, navigate]);

  return (
    <DashboardLayout>
      {/* grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-7 pt-1 pb-6 px-4 md:px-0 */}
      <div className="w-full max-w-[1440px] mx-auto grid grid-cols-5 gap-7 pt-1 pb-6 px-4">
        <div
          className="h-[300px] flex flex-col gap-5 items-center justify-center bg-white rounded-lg border border-purple-100 hover:border-purple-300 hover:bg-purple-50/5 cursor-pointer"
          onClick={() => setOpenCreateModel(true)}
        >
          <div className="size-12 flex items-center justify-center bg-purple-200/60 rounded-2xl">
            <CirclePlus size={20} className="text-purple-500" />
          </div>

          <h3 className="font-medium text-gray-800">Tạo CV mới</h3>
        </div>

        {allResume &&
          allResume?.map((resume) => (
            <ResumeSummaryCard
              key={resume._id}
              imgUrl={resume.thumbnailLink || ""}
              title={resume.title}
              lastUpdated={formatDistanceToNow(
                new Date(resume.updatedAt || new Date()),
                {
                  addSuffix: true,
                  locale: vi,
                }
              )}
              onSelect={() => navigate(`/resume/edit/${resume._id}`)}
            />
          ))}
      </div>

      <CreateResumeForm open={openCreateModel} setOpen={setOpenCreateModel} />
    </DashboardLayout>
  );
};

export default DashboardResume;
