import type { Resume } from "@/types/resume";
import { useEffect, useRef, useState } from "react";
import { LuMail, LuMapPinHouse, LuPhone, LuUser } from "react-icons/lu";
import ContactInfo from "../ResumeSections/ContactInfo";
import { FaFacebook, FaGithub, FaLinkedin } from "react-icons/fa";
import { CgWebsite } from "react-icons/cg";
import { formatYearMonth } from "../helpers/helper";
import EducationInfo from "../ResumeSections/EducationInfo";
import LanguageSection from "../ResumeSections/LanguageSection";
import WorkExperience from "../ResumeSections/WorkExperience";
import ProjectInfo from "../ResumeSections/ProjectInfo";
import SkillSection from "../ResumeSections/SkillSection";
import CertificationInfo from "../ResumeSections/CertificationInfo";

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

const TemplateOne = ({ resumeData, colorPalette, containerWidth }: Props) => {
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
      <div className="grid grid-cols-12 gap-8">
        <div
          className="col-span-4 py-10"
          style={{ backgroundColor: themeColors[0] }}
        >
          {/** profile info */}
          <div className="flex flex-col items-center px-2">
            <div
              className="w-[100px] h-[100px] max-w-[110px] max-h-[110px] rounded-full flex items-center justify-center"
              style={{ backgroundColor: themeColors[1] }}
            >
              {resumeData.profileInfo?.profilePreviewUrl ? (
                <img
                  src={resumeData.profileInfo.profilePreviewUrl}
                  alt={"image avatar"}
                  className="w-[90px] h-[90px] rounded-full"
                />
              ) : (
                <div
                  className="w-[90px] h-[90px] flex items-center justify-center text-5xl rounded-full"
                  style={{ color: themeColors[4] }}
                >
                  <LuUser />
                </div>
              )}
            </div>

            <h2 className="text-xl font-bold mt-3">
              {resumeData?.profileInfo?.fullName}
            </h2>
            <p className="text-sm text-center">
              {resumeData.profileInfo?.designation}
            </p>
          </div>

          <div className="my-6 mx-6">
            {/** contact info */}
            <div className="flex flex-col gap-4">
              {/** location */}
              <ContactInfo
                icon={<LuMapPinHouse />}
                iconBg={themeColors[2]}
                value={resumeData.contactInfo?.location || ""}
              />

              {/** mail */}
              <ContactInfo
                icon={<LuMail />}
                iconBg={themeColors[2]}
                value={resumeData.contactInfo?.email || ""}
              />

              {/** phone number */}
              <ContactInfo
                icon={<LuPhone />}
                iconBg={themeColors[2]}
                value={resumeData.contactInfo?.phoneNumber || ""}
              />

              {/** linkedin */}
              {resumeData.contactInfo?.linkedin && (
                <ContactInfo
                  icon={<FaLinkedin />}
                  iconBg={themeColors[2]}
                  value={resumeData.contactInfo?.linkedin || ""}
                />
              )}

              {/** github */}
              {resumeData.contactInfo?.github && (
                <ContactInfo
                  icon={<FaGithub />}
                  iconBg={themeColors[2]}
                  value={resumeData.contactInfo?.github || ""}
                />
              )}

              {/** facebook */}
              {resumeData.contactInfo?.facebook && (
                <ContactInfo
                  icon={<FaFacebook />}
                  iconBg={themeColors[2]}
                  value={resumeData.contactInfo?.facebook || ""}
                />
              )}

              {/** website */}
              {resumeData.contactInfo?.website && (
                <ContactInfo
                  icon={<CgWebsite />}
                  iconBg={themeColors[2]}
                  value={resumeData.contactInfo?.website || ""}
                />
              )}
            </div>

            {/** education */}
            <div className="mt-5">
              <Title text="Học vấn" color={themeColors[1]} />

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

            {/** languages */}
            <div className="mt-5">
              <Title text="Ngoại ngữ" color={themeColors[1]} />

              <LanguageSection
                languages={resumeData.languages}
                accentColor={themeColors[3]}
                bgColor={themeColors[2]}
              />
            </div>
          </div>
        </div>

        <div className="col-span-8 mr-10 pb-4">
          {/** summary */}
          <div className="mt-4">
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
                duration={`${formatYearMonth(
                  exp.startDate
                )} - ${formatYearMonth(exp.endDate)}`}
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

          {/** skills */}
          <div className="mt-4">
            <Title text="Kỹ năng" color={themeColors[1]} />

            <SkillSection
              skills={resumeData.skills || []}
              accentColor={themeColors[3]}
              bgColor={themeColors[2]}
            />
          </div>

          {/** certifications */}
          <div className="mt-4">
            <Title text="Chứng chỉ" color={themeColors[1]} />

            <div className="grid grid-cols-2 gap-2">
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

          {/** interests */}
          {(resumeData.interests || []).length > 0 &&
            (resumeData.interests || [])[0] !== "" && (
              <div className="mt-4">
                <Title text="Sở thích" color={themeColors[1]} />

                <div className="flex items-center flex-wrap gap-3 mt-4">
                  {resumeData.interests?.map((interest, index) => {
                    if (!interest) return null;
                    return (
                      <div
                        key={`interest_${index}`}
                        className="text-[10px] font-medium py-1 px-3 rounded-lg"
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

export default TemplateOne;
