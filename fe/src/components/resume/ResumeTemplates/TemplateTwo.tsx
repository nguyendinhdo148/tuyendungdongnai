import type { Resume } from "@/types/resume";
import { useEffect, useRef, useState } from "react";
import { LuMail, LuMapPinHouse, LuPhone, LuUser } from "react-icons/lu";
import ContactInfo from "../ResumeSections/ContactInfo";
import { FaFacebook, FaGithub, FaLinkedin } from "react-icons/fa";
import { CgWebsite } from "react-icons/cg";
import { formatYearMonth } from "../helpers/helper";
import EducationInfo from "../ResumeSections/EducationInfo";
// import LanguageSection from "../ResumeSections/LanguageSection";
import WorkExperience from "../ResumeSections/WorkExperience";
import ProjectInfo from "../ResumeSections/ProjectInfo";
import SkillSection from "../ResumeSections/SkillSection";
import CertificationInfo from "../ResumeSections/CertificationInfo";
import Progress from "../components/Progress";

interface TitleProps {
  text: string;
  color: string;
}

interface Props {
  resumeData: Resume;
  colorPalette: string[];
  containerWidth: number;
}

const DEFAULT_THEME = ["#EBFDFF", "#A1F4FD", "#CEFAFE", "#00B8DB", "#4A5565"];

const Title = ({ text, color }: TitleProps) => {
  return (
    <div className="relative w-fit mb-2.5">
      <span
        className="absolute bottom-0 left-0 w-full h-2"
        style={{ backgroundColor: color }}
      ></span>
      <h2 className={`relative text-sm font-bold uppercase`}>{text}</h2>
    </div>
  );
};

const TemplateTwo = ({ resumeData, colorPalette, containerWidth }: Props) => {
  const themeColors: string[] =
    colorPalette?.length > 0 ? colorPalette : DEFAULT_THEME;

  const resumeRef = useRef<HTMLDivElement>(null);
  const [baseWith, setBaseWith] = useState(800);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const actualBaseWidth = resumeRef.current?.offsetWidth;
    if (actualBaseWidth !== undefined) {
      setBaseWith(actualBaseWidth);
      setScale(containerWidth / actualBaseWidth);
    }
  }, [containerWidth]);

  return (
    <div
      ref={resumeRef}
      className="p-3 bg-white"
      style={{
        transform: containerWidth > 0 ? `scale(${scale})` : "none",
        transformOrigin: "left top",
        width: containerWidth > 0 ? `${baseWith}px` : "auto",
        height: "auto",
      }}
    >
      {/** info user */}
      <div className="px-10 pb-5">
        <div className="flex items-start gap-5 mb-5">
          <div
            className="w-[180px] h-[180px] max-w-[180px] max-h-[180px] rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: themeColors[1] }}
          >
            {resumeData.profileInfo?.profilePreviewUrl ? (
              <img
                src={resumeData.profileInfo.profilePreviewUrl}
                alt="avatar"
                className="w-[180px] h-[180px] object-cover rounded-2xl"
              />
            ) : (
              <div
                className="w-[180px] h-[180px] flex items-center justify-center text-5xl rounded-full"
                style={{ color: themeColors[4] }}
              >
                <LuUser />
              </div>
            )}
          </div>

          {/** contact info */}
          <div>
            <div className="grid grid-cols-12 gap-2 items-center">
              <div className="col-span-6">
                <h2 className="text-2xl font-bold">
                  {resumeData.profileInfo?.fullName}
                </h2>
                <p className="text-[15px] font-semibold mb-2">
                  {resumeData.profileInfo?.designation}
                </p>

                <ContactInfo
                  icon={<LuMapPinHouse />}
                  iconBg={themeColors[2]}
                  value={resumeData.contactInfo?.location || ""}
                />
              </div>

              <div className="col-span-6 flex flex-col gap-5 mt-2">
                <ContactInfo
                  icon={<LuMail />}
                  iconBg={themeColors[2]}
                  value={resumeData.contactInfo?.email || ""}
                />

                <ContactInfo
                  icon={<LuPhone />}
                  iconBg={themeColors[2]}
                  value={resumeData.contactInfo?.phoneNumber || ""}
                />
              </div>

              <div className="col-span-6">
                <ContactInfo
                  icon={<FaLinkedin />}
                  iconBg={themeColors[2]}
                  value={resumeData.contactInfo?.linkedin || ""}
                />
              </div>

              <div className="col-span-6">
                <ContactInfo
                  icon={<FaGithub />}
                  iconBg={themeColors[2]}
                  value={resumeData.contactInfo?.github || ""}
                />
              </div>

              <div className="col-span-6">
                <ContactInfo
                  icon={<FaFacebook />}
                  iconBg={themeColors[2]}
                  value={resumeData.contactInfo?.facebook || ""}
                />
              </div>

              <div className="col-span-6">
                <ContactInfo
                  icon={<CgWebsite />}
                  iconBg={themeColors[2]}
                  value={resumeData.contactInfo?.website || ""}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-10 pb-5">
        {/** summary */}
        <div>
          <Title text="Mục tiêu nghề nghiệp" color={themeColors[1]} />
          <p className="text-sm font-semibold">
            {resumeData.profileInfo?.summary}
          </p>
        </div>

        {/** work experience */}
        <div className="mt-4">
          <Title text="Kinh nghiệm làm việc" color={themeColors[1]} />

          {resumeData.workExperience?.map((exp, index) => (
            <WorkExperience
              key={`work_experience_${index}`}
              company={exp.company}
              role={exp.role}
              duration={`${formatYearMonth(exp.startDate)} - ${formatYearMonth(
                exp.endDate
              )}`}
              durationColor={themeColors[4]}
              description={exp.description}
            />
          ))}
        </div>

        {/** projects */}
        <div className="mt-4">
          <Title text="Dự án" color={themeColors[1]} />

          {resumeData.projects?.map((project, index) => (
            <ProjectInfo
              key={`project_${index}`}
              title={project.title}
              description={project.description}
              githubLink={project.github || ""}
              liveDemoLink={project.liveDemo || ""}
              bgColor={themeColors[2]}
              isPreview={project.title === ""}
            />
          ))}
        </div>

        {/** education */}
        <div className="mt-5">
          <Title text="Học vấn" color={themeColors[1]} />

          <div className="grid grid-cols-2 gap-3">
            {resumeData.education?.map((edu, index) => (
              <EducationInfo
                key={`education_${index}`}
                degree={edu.degree}
                institution={edu.institution}
                duration={`${formatYearMonth(
                  edu.startDate
                )} - ${formatYearMonth(edu.endDate)}`}
              />
            ))}
          </div>
        </div>

        {/** certifications */}
        <div className="mt-4">
          <Title text="Chứng chỉ" color={themeColors[1]} />

          <div className="grid grid-cols-2 gap-6">
            {resumeData.certifications?.map((cert, index) => (
              <CertificationInfo
                key={`cert_${index}`}
                title={cert.name}
                issuer={cert.issuer}
                year={cert.year}
                bgColor={themeColors[2]}
              />
            ))}
          </div>
        </div>

        {/** skills */}
        <div className="mt-4">
          <Title text="Kỹ năng" color={themeColors[1]} />

          <SkillSection
            skills={resumeData.skills || []}
            accentColor={themeColors[3]}
            bgColor={themeColors[2]}
          />
        </div>

        {/** languages & interests */}
        <div className="grid grid-cols-2 gap-4 mt-4 items-start">
          {/** languages */}
          <div className="">
            <Title text="Ngoại ngữ" color={themeColors[1]} />

            <div className="flex flex-col gap-2 mt-4">
              {resumeData.languages?.map((lang, index) => (
                <div key={`language_${index}`} className="flex items-center">
                  <p className="text-[12px] font-semibold text-gray-900 w-20 truncate">
                    {lang.name}
                  </p>
                  <Progress
                    progress={(lang.progress / 100) * 5}
                    color={themeColors[3]}
                    bgColor={themeColors[2]}
                    total={5}
                  />
                </div>
              ))}
            </div>
          </div>

          {/** interests */}
          {(resumeData.interests || []).length > 0 &&
            (resumeData.interests || [])[0] !== "" && (
              <div className="">
                <Title text="Sở thích" color={themeColors[1]} />

                <div className="flex items-center flex-wrap gap-3 mt-4">
                  {resumeData.interests?.map((interest, index) => {
                    if (!interest) return null;
                    return (
                      <div
                        key={`interest_${index}`}
                        className="text-[10px] font-medium py-1 px-3 rounded-lg whitespace-nowrap"
                        style={{ backgroundColor: themeColors[2] }}
                      >
                        {interest}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default TemplateTwo;
