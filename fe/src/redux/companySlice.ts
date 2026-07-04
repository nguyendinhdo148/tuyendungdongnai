import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Company } from "@/types/company";

interface CompanyState {
  companies: Company[];
  selectedCompany: Company | null;
  loading: boolean;
}

const initialState: CompanyState = {
  companies: [],
  selectedCompany: null,
  loading: false,
};

const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {
    setCompanies: (state, action: PayloadAction<Company[]>) => {
      state.companies = action.payload;
    },
    setSelectedCompany: (state, action: PayloadAction<Company | null>) => {
      state.selectedCompany = action.payload;
    },
    addCompany: (state, action: PayloadAction<Company>) => {
      state.companies.push(action.payload);
    },
    updateCompany: (state, action: PayloadAction<Company>) => {
      const index = state.companies.findIndex(
        (company) => company._id === action.payload._id
      );
      if (index !== -1) {
        state.companies[index] = action.payload;
      }
    },
    deleteCompany: (state, action: PayloadAction<string>) => {
      state.companies = state.companies.filter(
        (company) => company._id !== action.payload
      );
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const {
  setCompanies,
  setSelectedCompany,
  addCompany,
  updateCompany,
  deleteCompany,
  setLoading,
} = companySlice.actions;

export default companySlice.reducer;
