import { setSingleJob } from "@/redux/jobSlice";
import { API } from "@/utils/constant";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetSingleJob = (jobId: string) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchSingleJob = async () => {
      try {
        const res = await axios.get(`${API}/job/${jobId}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setSingleJob(res.data.jobs));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchSingleJob();
  }, [dispatch, jobId]);
};

export default useGetSingleJob;
