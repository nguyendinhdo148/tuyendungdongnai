import { Route, Routes } from "react-router-dom";
import { Suspense, lazy } from "react"; // Khai báo Suspense và lazy để code splitting
import { Toaster } from "react-hot-toast";
import Home from "./components/Home"; // Giữ lại trang chủ load tĩnh để tối ưu chỉ số LCP hiển thị tức thì
import ScrollRestoration from "./components/pages/components/ScrollRestoration";
import Chatbot from "./components/Chatbot";

// Component hiển thị trong lúc đợi tải các trang con (Dùng loader sẵn có của bạn)
import FullScreenLoader from "./components/skeletons/FullScreenLoader";

// ==========================================
// LAZY LOAD CÁC COMPONENTS (TỐI ƯU CORE WEB VITALS)
// ==========================================

// Auth
const Login = lazy(() => import("./components/auth/Login"));
const Signup = lazy(() => import("./components/auth/Signup"));
const ForgotPassword = lazy(() => import("./components/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("./components/auth/ResetPassword"));

// Pages
const Jobs = lazy(() => import("./components/pages/Jobs"));
const Browse = lazy(() => import("./components/pages/Browse"));
const Profile = lazy(() => import("./components/pages/Profile"));
const JobDetail = lazy(() => import("./components/pages/JobDetail"));
const CompanyDetail = lazy(() => import("./components/pages/CompanyDetail"));
const AppliedJob = lazy(() => import("./components/pages/AppliedJob"));
const SavedJobs = lazy(() => import("./components/pages/SavedJobs"));

// Blogs
const LandingPageBlog = lazy(() => import("./components/blog/LandingPageBlog"));
const BlogDetail = lazy(() => import("./components/blog/screens/BlogDetail"));
const CreateBlog = lazy(() => import("./components/blog/screens/CreateBlog"));
const UpdateBlog = lazy(() => import("./components/blog/screens/UpdateBlog"));
const ManagerBlogs = lazy(() => import("./components/blog/screens/ManagerBlogs"));

// Tools cơ bản
const ResumeReview = lazy(() => import("./components/tools/ResumeReview"));
const SalaryCalculator = lazy(() => import("./components/tools/SalaryCalculator"));
const PersonalTaxCalc = lazy(() => import("./components/tools/PersonalTaxCalc"));
const CompoundInterest = lazy(() => import("./components/tools/CompoundInterest"));
const SocialInsurance = lazy(() => import("./components/tools/SocialInsurance"));
const UnemploymentInsurance = lazy(() => import("./components/tools/UnemploymentInsurance"));
const SavingPlan = lazy(() => import("./components/tools/SavingPlan"));

// Tools MBTI
const MBTIPage = lazy(() => import("./components/MBTI/MBTIPage"));
const MBTITest = lazy(() => import("./components/MBTI/MBTITest"));
const MBTIResult = lazy(() => import("./components/MBTI/MBTIResult"));
const INFPPage = lazy(() => import("./components/MBTI/infp"));
const INFJPage = lazy(() => import("./components/MBTI/infj"));
const INTJPage = lazy(() => import("./components/MBTI/intj"));
const INTPPage = lazy(() => import("./components/MBTI/intp"));
const ISTJPage = lazy(() => import("./components/MBTI/istj"));
const ISFJPage = lazy(() => import("./components/MBTI/isfj"));
const ISTPPage = lazy(() => import("./components/MBTI/istp"));
const ISFPPage = lazy(() => import("./components/MBTI/isfp"));
const ESTPPage = lazy(() => import("./components/MBTI/estp"));
const ESFPPage = lazy(() => import("./components/MBTI/esfp"));
const ENFPPage = lazy(() => import("./components/MBTI/enfp"));
const ENTPPage = lazy(() => import("./components/MBTI/entp"));
const ESTJPage = lazy(() => import("./components/MBTI/estj"));
const ESFJPage = lazy(() => import("./components/MBTI/esfj"));
const ENFJPage = lazy(() => import("./components/MBTI/enfj"));
const ENTJPage = lazy(() => import("./components/MBTI/entj"));

// Tools Đa trí tuệ (MI)
const MIPage = lazy(() => import("./components/MI/MIPage"));
const MITest = lazy(() => import("./components/MI/MITest"));
const MIResult = lazy(() => import("./components/MI/MIResult"));

// Nhà tuyển dụng (Recruiter)
const RecruiterLayout = lazy(() => import("./components/recruiter/RecruiterLayout"));
const Recruiter = lazy(() => import("./components/recruiter/screeens/Recruiter"));
const Company = lazy(() => import("./components/recruiter/screeens/Company"));
const JobManager = lazy(() => import("./components/recruiter/screeens/JobManager"));
const Candidates = lazy(() => import("./components/recruiter/screeens/Candidates"));

// Hệ thống quản trị (Admin)
const AdminLayout = lazy(() => import("./components/admin/AdminLayout"));
const Admin = lazy(() => import("./components/admin/screeens/Admin"));
const CompanyAdmin = lazy(() => import("./components/admin/screeens/CompanyAdmin"));
const JobManagerAdmin = lazy(() => import("./components/admin/screeens/JobManagerAdmin"));
const UserManagerAdmin = lazy(() => import("./components/admin/screeens/UserManagerAdmin"));
const BlogManagerAdmin = lazy(() => import("./components/admin/screeens/BlogManagerAdmin"));

// Hồ sơ (Resume)
const LandingPage = lazy(() => import("./components/resume/LandingPage"));
const LearnMore = lazy(() => import("./components/resume/layout/LearnMore"));
const DashboardResume = lazy(() => import("./components/resume/Home/DashboardResume"));
const EditResume = lazy(() => import("./components/resume/ResumeUpdate/EditResume"));

// Trang 404
const NotFound = lazy(() => import("./components/pages/NotFound"));

function App() {
  return (
    <>
      <ScrollRestoration />
      
      {/* Bọc toàn bộ Router bằng Suspense để xử lý Lazy Loading mượt mà */}
      <Suspense fallback={<FullScreenLoader />}>
        <Routes>
          {/* User routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/applied-jobs" element={<AppliedJob />} />
          <Route path="/saved-jobs" element={<SavedJobs />} />
          <Route path="/job/detail/:slug" element={<JobDetail />} />
          <Route path="/company/detail/:slug" element={<CompanyDetail />} />
          <Route path="/tools/resume-review" element={<ResumeReview />} />

          {/* Blog routes */}
          <Route path="/blog" element={<LandingPageBlog />} />
          <Route path="/blog/detail/:slug" element={<BlogDetail />} />
          <Route path="/blog/create-blog" element={<CreateBlog />} />
          <Route path="/blog/update-blog/:id" element={<UpdateBlog />} />
          <Route path="/blog/manager-blogs" element={<ManagerBlogs />} />

          {/* Tools */}
          {/* MBTI */}
          <Route path="/tools/mbti" element={<MBTIPage />} />
          <Route path="/tools/mbti/test" element={<MBTITest />} />
          <Route path="/tools/mbti/result" element={<MBTIResult />} />
          <Route path="/tools/mbti/tinh-cach/infp" element={<INFPPage />} />
          <Route path="/tools/mbti/tinh-cach/infj" element={<INFJPage />} />
          <Route path="/tools/mbti/tinh-cach/intj" element={<INTJPage />} />
          <Route path="/tools/mbti/tinh-cach/intp" element={<INTPPage />} />
          <Route path="/tools/mbti/tinh-cach/istj" element={<ISTJPage />} />
          <Route path="/tools/mbti/tinh-cach/isfj" element={<ISFJPage />} />
          <Route path="/tools/mbti/tinh-cach/istp" element={<ISTPPage />} />
          <Route path="/tools/mbti/tinh-cach/isfp" element={<ISFPPage />} />
          <Route path="/tools/mbti/tinh-cach/estp" element={<ESTPPage />} />
          <Route path="/tools/mbti/tinh-cach/esfp" element={<ESFPPage />} />
          <Route path="/tools/mbti/tinh-cach/enfp" element={<ENFPPage />} />
          <Route path="/tools/mbti/tinh-cach/entp" element={<ENTPPage />} />
          <Route path="/tools/mbti/tinh-cach/estj" element={<ESTJPage />} />
          <Route path="/tools/mbti/tinh-cach/esfj" element={<ESFJPage />} />
          <Route path="/tools/mbti/tinh-cach/enfj" element={<ENFJPage />} />
          <Route path="/tools/mbti/tinh-cach/entj" element={<ENTJPage />} />

          {/* MI */}
          <Route path="/tools/mi" element={<MIPage />} />
          <Route path="/tools/mi/test" element={<MITest />} />
          <Route path="/tools/mi/result" element={<MIResult />} />

          {/* Tính toán & Bảo hiểm */}
          <Route path="/tools/gross-net" element={<SalaryCalculator />} />
          <Route path="/tools/personal-tax" element={<PersonalTaxCalc />} />
          <Route path="/tools/compound-interest" element={<CompoundInterest />} />
          <Route path="/tools/social-insurance" element={<SocialInsurance />} />
          <Route path="/tools/unemployment-insurance" element={<UnemploymentInsurance />} />
          <Route path="/tools/saving-plan" element={<SavingPlan />} />

          {/* Recruiter routes - Đã tối ưu cú pháp URL tương đối chuẩn v6 */}
          <Route path="/recruiter" element={<RecruiterLayout />}>
            <Route index element={<Recruiter />} />
            <Route path="company" element={<Company />} />
            <Route path="jobs" element={<JobManager />} />
            <Route path="candidates" element={<Candidates />} />
          </Route>

          {/* Admin routes - Đã tối ưu cú pháp URL tương đối chuẩn v6 */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Admin />} />
            <Route path="company" element={<CompanyAdmin />} />
            <Route path="jobs" element={<JobManagerAdmin />} />
            <Route path="blogs" element={<BlogManagerAdmin />} />
            <Route path="user" element={<UserManagerAdmin />} />
          </Route>

          {/* Resume routes */}
          <Route path="/resume" element={<LandingPage />} />
          <Route path="/resume/learn-more" element={<LearnMore />} />
          <Route path="/resume/dashboard-resume" element={<DashboardResume />} />
          <Route path="/resume/edit/:resumeId" element={<EditResume />} />

          {/* Page not found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>

      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{ duration: 2000 }}
      />
      <Chatbot />
    </>
  );
}

export default App;