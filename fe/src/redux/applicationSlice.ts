import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Application } from "@/types/application";

interface ApplicationState {
  applications: Application[];
  isLoading: boolean;
  error: string | null;
  selectedApplication: Application | null; // thêm dòng này
}

const initialState: ApplicationState = {
  applications: [],
  isLoading: false,
  error: null,
  selectedApplication: null,
};

const applicationSlice = createSlice({
  name: "application",
  initialState,
  reducers: {
    setApplications(state, action: PayloadAction<Application[]>) {
      state.applications = action.payload;
    },
    setSelectedApplication(state, action: PayloadAction<Application | null>) {
      state.selectedApplication = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const { setApplications, setSelectedApplication, setLoading, setError } =
  applicationSlice.actions;

export default applicationSlice.reducer;
