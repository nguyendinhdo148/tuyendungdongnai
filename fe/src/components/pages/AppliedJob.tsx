import { useEffect } from "react";
import Navbar from "../shared/Navbar";
import AppliedJobTable from "./components/AppliedJobTable";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "@/redux/store";

const AppliedJob = () => {
  const { user } = useSelector((store: RootState) => store.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else if (user.role === "recruiter") {
      navigate("/recruiter");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 mt-6">
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">
            Công việc đã ứng tuyển
          </h1>
          <AppliedJobTable />
        </div>
      </div>
    </div>
  );
};

export default AppliedJob;
