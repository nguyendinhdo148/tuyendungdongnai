import { SaveJob } from "./../types/saveJob";
import { createSlice } from "@reduxjs/toolkit";

interface SaveJobState {
  allSavedJobs: SaveJob[];
  jobsForUserIsSaved: SaveJob[];
  isLoading: boolean;
}

const initialState: SaveJobState = {
  allSavedJobs: [],
  jobsForUserIsSaved: [],
  isLoading: false,
};

const saveJobSlice = createSlice({
  name: "saveJob",
  initialState,
  reducers: {
    setAllSavedJobs: (state, action) => {
      state.allSavedJobs = action.payload;
    },
    setJobsForUserIsSaved: (state, action) => {
      state.jobsForUserIsSaved = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setAllSavedJobs, setJobsForUserIsSaved, setLoading } =
  saveJobSlice.actions;
export default saveJobSlice.reducer;
