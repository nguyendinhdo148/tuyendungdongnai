import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";
import TittleInput from "../components/TittleInput";
import { useReactToPrint } from "react-to-print";
import axios from "axios";
import { API } from "@/utils/constant";
import {
  ArrowLeft,
  ArrowRight,
  CircleAlert,
  Download,
  Palette,
  Save,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import StepProgress from "../components/StepProgress";
import ProfileInfoForm from "./Forms/ProfileInfoForm";
import ContactInfoForm from "./Forms/ContactInfoForm";
import WorkExperienceForm from "./Forms/WorkExperienceForm";
import EducationDetailsForm from "./Forms/EducationDetailsForm";
import SkillsInfoForm from "./Forms/SkillsInfoForm";
import ProjectsDetailsForm from "./Forms/ProjectsDetailsForm";
import CertificationInfoForm from "./Forms/CertificationInfoForm";
import AdditionalInfoForm from "./Forms/AdditionalInfoForm";
import RenderResume from "../ResumeTemplates/RenderResume";
import toast from "react-hot-toast";
import {
  captureElementAsImage,
  dataURLtoFile,
  fixTailwindColors,
} from "../helpers/helper";
import ThemeSelector from "./ThemeSelector";
import Modal from "../components/Modal";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

type ResumeData = {
  // userId: string;
  title: string;
  thumbnailLink: string;
  profileInfo: {
    profileImg: File | null;
    profilePreviewUrl: string;
    fullName: string;
    designation: string;
    summary: string;
  };
  template: {
    theme: string;
    colorPalette: string[];
  };
  contactInfo: {
    email: string;
    phoneNumber: string;
    location: string;
    linkedin: string;
    github: string;
    facebook: string;
    website: string;
  };
  workExperience: Array<{
    company: string;
    role: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  education: Array<{
    degree: string;
    institution: string;
    startDate: string;
    endDate: string;
  }>;
  skills: Array<{
    name: string;
    progress: number;
  }>;
  projects: Array<{
    title: string;
    description: string;
    github: string;
    liveDemo: string;
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    year: string;
  }>;
  languages: Array<{
    name: string;
    progress: number;
  }>;
  interests: string[];
};

const EditResume = () => {
  const { user } = useSelector((store: RootState) => store.auth);
  const { resumeId } = useParams();
  const navigate = useNavigate();

  const resumeRef = useRef<HTMLDivElement>(null);
  const resumeDownloadRef = useRef<HTMLDivElement>(null);

  const [baseWith, setBaseWith] = useState(800);

  const [openThemeSelector, setOpenThemeSelector] = useState(false);

  const [openPreviewModal, setOpenPreviewModal] = useState(false);

  const [currentPage, setCurrentPage] = useState("profile-info");
  const [progress, setProgress] = useState(0);
  const [resumeData, setResumeData] = useState<ResumeData>({
    // userId: "",
    title: "",
    thumbnailLink: "",
    profileInfo: {
      profileImg: null,
      profilePreviewUrl: "",
      fullName: "",
      designation: "",
      summary: "",
    },
    template: {
      theme: "",
      colorPalette: [""],
    },
    contactInfo: {
      email: "",
      phoneNumber: "",
      location: "",
      linkedin: "",
      github: "",
      facebook: "",
      website: "",
    },
    workExperience: [
      {
        company: "",
        role: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ],
    education: [
      {
        degree: "",
        institution: "",
        startDate: "",
        endDate: "",
      },
    ],
    skills: [
      {
        name: "",
        progress: 0,
      },
    ],
    projects: [
      {
        title: "",
        description: "",
        github: "",
        liveDemo: "",
      },
    ],
    certifications: [
      {
        name: "",
        issuer: "",
        year: "",
      },
    ],
    languages: [
      {
        name: "",
        progress: 0,
      },
    ],
    interests: [""],
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // redirect to login page if user is not logged in
  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else if (user.role === "recruiter") {
      navigate("/recruiter");
    } else if (user.role === "admin") {
      navigate("/admin");
    }
  }, [user, navigate]);

  // validate inputs
  const validateAndNext = () => {
    const errors = [];

    switch (currentPage) {
      case "profile-info": {
        const { fullName, designation, summary } = resumeData.profileInfo;
        if (!fullName.trim()) errors.push("FullName is required");
        if (!designation.trim()) errors.push("Designation is required");
        if (!summary.trim()) errors.push("Summary is required");
        break;
      }

      case "contact-info": {
        const { email, phoneNumber } = resumeData.contactInfo;
        if (!email?.trim() || !/^\S+@\S+\.\S+$/.test(email))
          errors.push("Valid Email is required");
        if (!phoneNumber?.trim())
          errors.push("Valid 10-digit phone number is required");
        break;
      }

      case "work-experience": {
        resumeData.workExperience.forEach(
          ({ company, role, startDate, endDate }, index) => {
            if (!company.trim())
              errors.push(`Company is required ${index + 1}`);
            if (!role.trim()) errors.push(`Role is required ${index + 1}`);
            if (!startDate.trim() || !endDate.trim())
              errors.push(
                `Start Date and End Date are required in experience ${
                  index + 1
                }`
              );
          }
        );
        break;
      }

      case "education-info": {
        resumeData.education.forEach(
          ({ degree, institution, startDate, endDate }, index) => {
            if (!degree.trim()) errors.push(`Degree is required ${index + 1}`);
            if (!institution.trim())
              errors.push(`Institution is required ${index + 1}`);
            if (!startDate.trim() || !endDate.trim())
              errors.push(
                `Start Date and End Date are required in education ${index + 1}`
              );
          }
        );
        break;
      }

      case "skills": {
        resumeData.skills.forEach(({ name }, index) => {
          if (!name.trim()) errors.push(`Skill is required ${index + 1}`);
          // if (progress < 1 || progress > 100)
          //   errors.push(`Progress should be between 1 to 100 ${index + 1}`);
        });
        break;
      }

      case "projects": {
        resumeData.projects.forEach(({ title, description }, index) => {
          if (!title.trim()) errors.push(`Title is required ${index + 1}`);
          if (!description.trim())
            errors.push(`Description is required ${index + 1}`);
        });
        break;
      }

      case "certifications": {
        resumeData.certifications.forEach(({ name, issuer }, index) => {
          if (!name.trim()) errors.push(`Title is required ${index + 1}`);
          if (!issuer.trim()) errors.push(`Issuer is required ${index + 1}`);
        });
        break;
      }

      case "additionalInfo": {
        if (
          resumeData.languages.length === 0 ||
          !resumeData.languages[0].name?.trim()
        ) {
          errors.push("At least one language is required");
        }

        if (
          resumeData.interests.length === 0 ||
          !resumeData.interests[0]?.trim()
        ) {
          errors.push("At least one interest is required");
        }
        break;
      }

      default:
        break;
    }

    if (errors.length > 0) {
      setErrorMsg(errors.join(", "));
      return;
    }

    // move to next step
    setErrorMsg("");
    goToNextStep();
  };

  // function navigate to next step
  const goToNextStep = () => {
    const pages = [
      "profile-info",
      "contact-info",
      "work-experience",
      "education-info",
      "skills",
      "projects",
      "certifications",
      "additionalInfo",
    ];

    if (currentPage === "additionalInfo") setOpenPreviewModal(true);

    const currentIndex = pages.indexOf(currentPage);
    if (currentIndex !== -1 && currentIndex < pages.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentPage(pages[nextIndex]);

      // set progress
      const percent = Math.round((nextIndex / (pages.length - 1)) * 100);
      setProgress(percent);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // function to navigate to previous step
  const goBack = () => {
    const pages = [
      "profile-info",
      "contact-info",
      "work-experience",
      "education-info",
      "skills",
      "projects",
      "certifications",
      "additionalInfo",
    ];

    if (currentPage === "profile-info") navigate("/resume/dashboard-resume");

    const currentIndex = pages.indexOf(currentPage);
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentPage(pages[prevIndex]);

      // set progress
      const percent = Math.round((prevIndex / (pages.length - 1)) * 100);
      setProgress(percent);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const renderForm = () => {
    switch (currentPage) {
      case "profile-info":
        return (
          <ProfileInfoForm
            profileData={resumeData.profileInfo}
            updateSection={(key, value) => {
              updateSection(
                "profileInfo",
                key as keyof typeof resumeData.profileInfo,
                value as string | File
              );
            }}
            onNext={validateAndNext}
          />
        );

      case "contact-info":
        return (
          <ContactInfoForm
            contactInfo={resumeData.contactInfo}
            updateSection={(key, value) =>
              updateSection("contactInfo", key, value as string)
            }
          />
        );

      case "work-experience":
        return (
          <WorkExperienceForm
            workExperience={resumeData.workExperience}
            updateArrayItem={(index, key, value) =>
              updateArrayItem("workExperience", index, key, value as string)
            }
            addArrayItem={(newItem) => addArrayItem("workExperience", newItem)}
            removeArrayItem={(index) =>
              removeArrayItem("workExperience", index)
            }
          />
        );

      case "education-info":
        return (
          <EducationDetailsForm
            educationInfo={resumeData.education}
            updateArrayItem={(index, key, value) =>
              updateArrayItem("education", index, key, value as string)
            }
            addArrayItem={(newItem) => addArrayItem("education", newItem)}
            removeArrayItem={(index) => removeArrayItem("education", index)}
          />
        );

      case "skills":
        return (
          <SkillsInfoForm
            skillsInfo={resumeData.skills}
            updateArrayItem={(index, key, value) =>
              updateArrayItem("skills", index, key, value as number)
            }
            addArrayItem={(newItem) => addArrayItem("skills", newItem)}
            removeArrayItem={(index) => removeArrayItem("skills", index)}
          />
        );

      case "projects":
        return (
          <ProjectsDetailsForm
            projectInfo={resumeData.projects}
            updateArrayItem={(index, key, value) =>
              updateArrayItem("projects", index, key, value as string)
            }
            addArrayItem={(newItem) => addArrayItem("projects", newItem)}
            removeArrayItem={(index) => removeArrayItem("projects", index)}
          />
        );

      case "certifications":
        return (
          <CertificationInfoForm
            certificationInfo={resumeData.certifications}
            updateArrayItem={(index, key, value) =>
              updateArrayItem("certifications", index, key, value as string)
            }
            addArrayItem={(newItem) => addArrayItem("certifications", newItem)}
            removeArrayItem={(index) =>
              removeArrayItem("certifications", index)
            }
          />
        );

      case "additionalInfo":
        return (
          <AdditionalInfoForm
            languages={resumeData.languages}
            interests={resumeData.interests}
            updateArrayItem={(section, index, key, value) =>
              updateArrayItem(section, index, key, value as string)
            }
            addArrayItem={(section, newItem) => addArrayItem(section, newItem)}
            removeArrayItem={(section, index) =>
              removeArrayItem(section, index)
            }
          />
        );

      default:
        return null;
    }
  };

  const updateSection = <
    T extends {
      [K in keyof ResumeData]: ResumeData[K] extends object ? K : never;
    }[keyof ResumeData],
    K extends keyof ResumeData[T]
  >(
    section: T,
    key: K,
    value: ResumeData[T][K]
  ) => {
    setResumeData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  // add  new item to array
  const updateArrayItem = (
    section: keyof ResumeData,
    index: number,
    key: string | null,
    value: unknown
  ) => {
    setResumeData((prev) => {
      const updatedArray = Array.isArray(prev[section])
        ? [...(prev[section] as unknown[])]
        : [];

      if (key === null) {
        updatedArray[index] = value;
      } else {
        updatedArray[index] = {
          ...(typeof updatedArray[index] === "object" &&
          updatedArray[index] !== null
            ? updatedArray[index]
            : {}),
          [key]: value,
        };
      }

      return {
        ...prev,
        [section]: updatedArray,
      };
    });
  };

  // add new item to array
  const addArrayItem = <T extends keyof ResumeData>(
    section: T,
    newItem: ResumeData[T] extends Array<infer U> ? U : never
  ) => {
    setResumeData((prev) => ({
      ...prev,
      [section]: [
        ...(prev[section] as unknown as ResumeData[T] extends Array<infer U>
          ? U[]
          : never),
        newItem,
      ],
    }));
  };

  // remove item from array
  const removeArrayItem = <T extends keyof ResumeData>(
    section: T,
    index: number
  ) => {
    setResumeData((prev) => {
      const updatedArray = Array.isArray(prev[section])
        ? [
            ...(prev[section] as unknown as ResumeData[T] extends Array<infer U>
              ? U[]
              : never),
          ]
        : [];
      updatedArray.splice(index, 1);
      return {
        ...prev,
        [section]: updatedArray,
      };
    });
  };

  // fetch resume info by id
  const fetchResumeDetailsById = async () => {
    try {
      const res = await axios.get(`${API}/resume/${resumeId}`, {
        withCredentials: true,
      });

      if (res.data && res.data.profileInfo) {
        const resumeInfo = res.data;

        setResumeData((prevData) => ({
          ...prevData,
          title: resumeInfo.title || "Untitled Resume",
          template: resumeInfo.template,
          profileInfo: resumeInfo.profileInfo || prevData?.profileInfo,
          contactInfo: resumeInfo.contactInfo || prevData?.contactInfo,
          workExperience: resumeInfo.workExperience || prevData?.workExperience,
          education: resumeInfo.education || prevData?.education,
          skills: resumeInfo.skills || prevData?.skills,
          projects: resumeInfo.projects || prevData?.projects,
          certifications: resumeInfo.certifications || prevData?.certifications,
          languages: resumeInfo.languages || prevData?.languages,
          interests: resumeInfo.interests || prevData?.interests,
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  // upload thumbnail and resume profile img
  const uploadResumeImages = async () => {
    try {
      setIsLoading(true);

      if (resumeRef.current) fixTailwindColors(resumeRef.current);

      // Chụp ảnh thumbnail
      const imageDataUrl = await captureElementAsImage(
        resumeRef.current as HTMLElement
      );
      const thumbnailFile = dataURLtoFile(
        imageDataUrl,
        `resume-${resumeId}.png`
      );

      const profileImageFile = resumeData.profileInfo.profileImg || null;

      const formData = new FormData();
      if (profileImageFile) formData.append("profileImage", profileImageFile);
      if (thumbnailFile) formData.append("thumbnail", thumbnailFile);

      let thumbnailLink = resumeData.thumbnailLink;
      let profilePreviewUrl = resumeData.profileInfo.profilePreviewUrl;

      const uploadResponse = await axios.put(
        `${API}/resume/upload-images/${resumeId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      thumbnailLink = uploadResponse.data.thumbnailLink || thumbnailLink;
      profilePreviewUrl =
        uploadResponse.data.profilePreviewUrl || profilePreviewUrl;

      // Luôn cập nhật data resume (kể cả khi không upload ảnh)
      await updateResumeDetails(thumbnailLink, profilePreviewUrl);

      toast.success("Cập nhật hồ sơ thành công!");
      navigate("/resume/dashboard-resume");
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Upload error:", error.message);
        toast.error(error.message || "Đã có lỗi xảy ra khi tải lên hồ sơ.");
      } else {
        console.error("Unknown error:", error);
        toast.error("Đã có lỗi xảy ra khi tải lên hồ sơ.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // update resume details
  const updateResumeDetails = async (
    thumbnailLink: string,
    profilePreviewUrl: string
  ) => {
    try {
      setIsLoading(true);

      await axios.put(
        `${API}/resume/${resumeId}`,
        {
          ...resumeData,
          thumbnailLink: thumbnailLink || "",
          profileInfo: {
            ...resumeData.profileInfo,
            profilePreviewUrl: profilePreviewUrl || "",
          },
        },
        {
          withCredentials: true,
        }
      );
    } catch (error) {
      console.log("Error updating resume: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  // delete resume
  const handleDeleteResume = async () => {
    try {
      const result = await Swal.fire({
        title: "Bạn có chắc muốn xóa hồ sơ này?",
        text: "Hành động này không thể hoàn tác!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Xóa",
        cancelButtonText: "Hủy",
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
      });

      if (!result.isConfirmed) return;

      setIsLoading(true);
      const res = await axios.delete(`${API}/resume/${resumeId}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success("Xóa hồ sơ thành công!");
        navigate("/resume/dashboard-resume");
      }
    } catch (error) {
      console.error("Error deleting resume:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // download resume
  const reactToPrintFn = useReactToPrint({
    contentRef: resumeDownloadRef,
    documentTitle: resumeData.title || "Resume",
  });

  // funtion to update base width based on resume container size
  const updateBaseWidth = () => {
    if (resumeRef.current) {
      setBaseWith(resumeRef.current?.offsetWidth);
    }
  };

  // useEffect to update base width
  useEffect(() => {
    updateBaseWidth();
    window.addEventListener("resize", updateBaseWidth);

    if (resumeId) {
      fetchResumeDetailsById();
    }

    return () => {
      window.removeEventListener("resize", updateBaseWidth);
    };
  }, [resumeId]);

  return (
    <div className="bg-gray-50">
      <DashboardLayout>
        <div className="w-full px-5 mx-auto">
          <div className="flex items-center justify-between gap-5 bg-white rounded-lg border border-purple-100 py-3 px-4 mb-4">
            <TittleInput
              title={resumeData.title}
              setTitle={(value) =>
                setResumeData({ ...resumeData, title: value })
              }
            />

            <div className="flex items-center gap-4">
              {/* Change theme */}
              <Button
                className="bg-[#eed8fc] text-[#5e2e82] cursor-pointer hover:bg-[#e3c3fa] hover:shadow-md transition"
                onClick={() => setOpenThemeSelector(true)}
              >
                <Palette className="size-4" />
                <span className="hidden md:block">Thay đổi chủ đề</span>
              </Button>

              {/* Delete resume */}
              <Button
                className="bg-[#eed8fc] text-[#5e2e82] cursor-pointer hover:bg-[#e3c3fa] hover:shadow-md transition"
                onClick={handleDeleteResume}
              >
                <Trash2 className="size-4" />
                <span className="hidden md:block">Xóa</span>
              </Button>

              {/* Download resume */}
              <Button
                className="bg-[#eed8fc] text-[#5e2e82] cursor-pointer hover:bg-[#e3c3fa] hover:shadow-md transition"
                onClick={() => setOpenPreviewModal(true)}
              >
                <Download className="size-4" />
                <span className="hidden md:block">Xem & Tải xuống</span>
              </Button>
            </div>
          </div>

          {/* Resume form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-white rounded-lg border border-purple-100 overflow-hidden">
              <StepProgress progress={progress} />

              {renderForm()}

              <div className="mx-5">
                {errorMsg && (
                  <div className="flex items-center gap-2 text-[11px] font-medium text-amber-600 bg-amber-100 px-2 py-0.5 my-1 rounded">
                    <CircleAlert className="size-4" /> {errorMsg}
                  </div>
                )}

                <div className="flex items-end justify-end gap-3 mt-3 mb-5">
                  <Button
                    className="bg-[#eed8fc] text-[#5e2e82] cursor-pointer hover:bg-[#e3c3fa] hover:shadow-md transition"
                    onClick={goBack}
                    disabled={isLoading}
                  >
                    <ArrowLeft className="size-4" /> Trở lại
                  </Button>

                  <Button
                    className="bg-[#eed8fc] text-[#5e2e82] cursor-pointer hover:bg-[#e3c3fa] hover:shadow-md transition"
                    onClick={uploadResumeImages}
                    disabled={isLoading}
                  >
                    <Save className="size-4" />{" "}
                    {isLoading ? "Đang cập nhật..." : "Lưu & Thoát"}
                  </Button>

                  <Button
                    className="bg-gradient-to-r cursor-pointer from-[#a855f7] to-[#7e22ce] text-white hover:from-[#9333ea] hover:to-[#6b21a8] font-semibold px-6 py-2 rounded-md transition flex items-center gap-2"
                    onClick={validateAndNext}
                    disabled={isLoading}
                  >
                    {currentPage === "additionalInfo" && (
                      <Download className="size-4" />
                    )}

                    {currentPage === "additionalInfo"
                      ? "Xem trước"
                      : "Tiếp theo"}

                    {currentPage !== "additionalInfo" && (
                      <ArrowRight className="size-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Resume template */}
            <div ref={resumeRef} className="h-[100vh]">
              <RenderResume
                templateId={resumeData.template?.theme || ""}
                resumeData={resumeData}
                colorPalette={resumeData.template?.colorPalette || []}
                containerWidth={baseWith}
              />
            </div>
          </div>
        </div>

        {/* Choose template & theme */}
        <Modal
          isOpen={openThemeSelector}
          onClose={() => setOpenThemeSelector(false)}
          title="Thay đổi chủ đề"
        >
          <div className="w-[95vw] h-[85vh]">
            <ThemeSelector
              selectorTheme={
                resumeData.template || { theme: "", colorPalette: [] }
              }
              setSelectorTheme={(value) => {
                setResumeData((prev) => ({
                  ...prev,
                  template: {
                    ...prev.template,
                    ...value,
                  },
                }));
              }}
              resumeData={null}
              onClose={() => setOpenThemeSelector(false)}
            />
          </div>
        </Modal>

        {/* Preview & download resume */}
        <Modal
          isOpen={openPreviewModal}
          onClose={() => setOpenPreviewModal(false)}
          title={resumeData.title}
          showActionBtn
          actionBtnIcon={<Download className="size-4" />}
          actionBtnText="Tải xuống"
          onActionClick={() => reactToPrintFn()}
        >
          <div
            ref={resumeDownloadRef}
            className="w-[90vw] h-[80vh] force-print-size"
          >
            <RenderResume
              templateId={resumeData.template?.theme || ""}
              resumeData={resumeData}
              colorPalette={resumeData.template?.colorPalette || []}
              containerWidth={0}
            />
          </div>
        </Modal>
      </DashboardLayout>
    </div>
  );
};

export default EditResume;
