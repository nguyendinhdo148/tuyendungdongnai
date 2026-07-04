import { Job } from "@/types/job";
import { createSlice } from "@reduxjs/toolkit";

interface JobState {
  allJobs: Job[];
  singleJob: Job | undefined;
  jobsForRecruiter: Job[];
  jobsForAdmin: Job[];
  selectedJob: Job | null;
  searchedQuery: string | "";
  isLoading: boolean;
  error: string | null;
}

const initialState: JobState = {
  allJobs: [],
  singleJob: undefined,
  jobsForRecruiter: [],
  jobsForAdmin: [],
  selectedJob: null,
  searchedQuery: "",
  isLoading: false,
  error: null,
};

const jobSlice = createSlice({
  name: "job",
  initialState,
  reducers: {
    setAllJobs: (state, action) => {
      state.allJobs = action.payload;
    },
    setSingleJob: (state, action) => {
      state.singleJob = action.payload;
    },
    setJobsForRecruiter: (state, action) => {
      state.jobsForRecruiter = action.payload;
    },
    setJobsForAdmin: (state, action) => {
      state.jobsForAdmin = action.payload;
    },
    setSelectedJob: (state, action) => {
      state.selectedJob = action.payload;
    },
    setSearchedQuery: (state, action) => {
      state.searchedQuery = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    resetError: (state) => {
      state.error = null;
    },
    resetSelectedJob: (state) => {
      state.selectedJob = null;
    },
  },
});

export const {
  setAllJobs,
  setSingleJob,
  setJobsForRecruiter,
  setJobsForAdmin,
  setSelectedJob,
  setSearchedQuery,
  setLoading,
  setError,
  resetError,
  resetSelectedJob,
} = jobSlice.actions;
export default jobSlice.reducer;
