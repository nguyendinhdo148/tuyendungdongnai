"use client";

import type React from "react";

import type { Resume } from "@/types/resume";
import { useEffect, useRef, useState } from "react";
import {
  LuMail,
  LuMapPin,
  LuPhone,
  LuUser,
  LuBriefcase,
  LuGraduationCap,
  LuAward,
  LuCode,
  LuHeart,
  LuGlobe,
  LuCalendar,
} from "react-icons/lu";
import { FaFacebook, FaGithub, FaLinkedin } from "react-icons/fa";
import { formatYearMonth } from "../helpers/helper";
import LanguageSection from "../ResumeSections/LanguageSection";
import { GoLink } from "react-icons/go";
import { CgWebsite } from "react-icons/cg";
import ContactInfo from "../ResumeSections/ContactInfo";
import ActionLink from "../components/ActionLink";

interface TitleProps {
  text: string;
  icon: React.ReactNode;
  color: string;
}

interface Props {
  resumeData: Resume;
  colorPalette: string[];
  containerWidth: number;
}

const DEFAULT_THEME = ["#FFFFFF", "#F5F5F5", "#E0E0E0", "#757575", "#212121"];

const Title = ({ text, icon, color }: TitleProps) => {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="p-1.5 rounded-md" style={{ backgroundColor: color }}>
        <span className="text-base text-white">{icon}</span>
      </div>
      <h2
        className="text-base font-semibold uppercase tracking-wider"
        style={{ color }}
      >
        {text}
      </h2>
      <div
        className="flex-grow h-px ml-2"
        style={{ backgroundColor: color, opacity: 0.3 }}
      ></div>
    </div>
  );
};

// Enhanced Image component with proper handling to prevent pixelation
const ProfileImage = ({
  src,
  fallbackIcon,
  accentColor,
  bgColor,
  textColor,
}: {
  src?: string;
  fallbackIcon: React.ReactNode;
  accentColor: string;
  bgColor: string;
  textColor: string;
}) => {
  const [imgError, setImgError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="relative">
      <div
        className="w-[140px] h-[140px] rounded-md overflow-hidden border-2 flex items-center justify-center shadow-md"
        style={{ borderColor: accentColor }}
      >
        {src && !imgError ? (
          <>
            {/* Loading skeleton */}
            {!imageLoaded && (
              <div
                className="absolute inset-0 animate-pulse"
                style={{ backgroundColor: bgColor }}
              ></div>
            )}
            <img
              src={src || "/placeholder.svg"}
              alt="Profile"
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onError={() => setImgError(true)}
              onLoad={() => setImageLoaded(true)}
              loading="eager"
              crossOrigin="anonymous"
            />
          </>
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-4xl"
            style={{ backgroundColor: bgColor, color: textColor }}
          >
            {fallbackIcon}
          </div>
        )}
      </div>
    </div>
  );
};

// Badge component
const SkillBadge = ({
  skill,
  bgColor,
  textColor,
}: {
  skill: string;
  bgColor: string;
  textColor: string;
}) => {
  return (
    <div
      className="px-3 py-1.5 text-xs font-medium rounded-md"
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      {skill}
    </div>
  );
};

// Timeline Item component
const TimelineItem = ({
  title,
  subtitle,
  date,
  description,
  color,
  textColor,
}: {
  title: string;
  subtitle: string;
  date: string;
  description?: string;
  color: string;
  textColor: string;
}) => {
  return (
    <div className="relative pl-6 pb-6">
      {/* Timeline dot */}
      <div
        className="absolute left-0 top-0 w-3 h-3 rounded-full"
        style={{ backgroundColor: color }}
      ></div>
      {/* Timeline line */}
      <div
        className="absolute left-1.5 top-3 bottom-0 w-px"
        style={{ backgroundColor: color, opacity: 0.3 }}
      ></div>

      <div className="mb-1">
        <div className="flex justify-between items-start flex-wrap">
          <h3 className="font-semibold text-base" style={{ color: textColor }}>
            {title}
          </h3>
          <div
            className="flex items-center gap-1 text-xs px-2 py-1 rounded-md"
            style={{ backgroundColor: color, color: "#FFFFFF" }}
          >
            <LuCalendar className="w-3 h-3" />
            <span>{date}</span>
          </div>
        </div>
        <p className="text-sm mb-2" style={{ color }}>
          {subtitle}
        </p>
      </div>
      {description && (
        <p className="text-sm" style={{ color: textColor }}>
          {description}
        </p>
      )}
    </div>
  );
};

const TemplateSix = ({ resumeData, colorPalette, containerWidth }: Props) => {
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
      className="bg-white"
      style={{
        transform: containerWidth > 0 ? `scale(${scale})` : "none",
        transformOrigin: "left top",
        width: containerWidth > 0 ? `${baseWith}px` : "auto",
        height: "auto",
      }}
    >
      {/* Left Sidebar */}
      <div className="flex flex-col md:flex-row">
        <div
          className="w-full md:w-1/3 p-6"
          style={{ backgroundColor: themeColors[1] }}
        >
          {/* Profile Image */}
          <div className="flex justify-center mb-6">
            <ProfileImage
              src={resumeData.profileInfo?.profilePreviewUrl || undefined}
              fallbackIcon={<LuUser />}
              accentColor={themeColors[3]}
              bgColor={themeColors[0]}
              textColor={themeColors[4]}
            />
          </div>

          {/* Contact Information */}
          <div className="mb-6">
            <Title
              text="Liên hệ"
              icon={<LuPhone className="w-4 h-4 text-white" />}
              color={themeColors[3]}
            />
            <div className="space-y-3">
              <ContactInfo
                icon={<LuMapPin />}
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
            </div>
          </div>

          {/* Social Links */}
          <div className="mb-6">
            <Title
              text="Mạng xã hội"
              icon={<LuGlobe className="w-4 h-4 text-white" />}
              color={themeColors[3]}
            />
            <div className="space-y-3">
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
          </div>

          {/* Skills */}
          <div className="mb-6">
            <Title
              text="Kỹ năng"
              icon={<LuCode className="w-4 h-4" />}
              color={themeColors[3]}
            />
            <div className="flex flex-wrap gap-2">
              {resumeData.skills?.map((skill, index) => (
                <SkillBadge
                  key={`skill_${index}`}
                  skill={typeof skill === "string" ? skill : skill.name}
                  bgColor={themeColors[3]}
                  textColor="#FFFFFF"
                />
              ))}
            </div>
          </div>

          {/* Languages */}
          <div className="mb-6">
            <Title
              text="Ngoại ngữ"
              icon={<LuGlobe className="w-4 h-4" />}
              color={themeColors[3]}
            />
            <div className="space-y-3">
              <LanguageSection
                languages={resumeData.languages}
                accentColor={themeColors[3]}
                bgColor={themeColors[0]}
              />
            </div>
          </div>

          {/* Interests */}
          {resumeData.interests &&
            resumeData.interests.length > 0 &&
            resumeData.interests[0] !== "" && (
              <div>
                <Title
                  text="Sở thích"
                  icon={<LuHeart className="w-4 h-4" />}
                  color={themeColors[3]}
                />
                <div className="flex flex-wrap gap-2">
                  {resumeData.interests?.map((interest, index) => {
                    if (!interest) return null;
                    return (
                      <SkillBadge
                        key={`interest_${index}`}
                        skill={interest}
                        bgColor={themeColors[3]}
                        textColor="#FFFFFF"
                      />
                    );
                  })}
                </div>
              </div>
            )}
        </div>

        {/* Main Content */}
        <div className="w-full md:w-2/3 p-6">
          {/* Header */}
          <div className="relative">
            <div className="mb-6 pb-4" style={{ borderColor: themeColors[2] }}>
              <h1
                className="text-2xl font-bold mb-1"
                style={{ color: themeColors[4] }}
              >
                {resumeData.profileInfo?.fullName}
              </h1>
              <p className="text-lg mb-3" style={{ color: themeColors[3] }}>
                {resumeData.profileInfo?.designation}
              </p>
              {resumeData.profileInfo?.summary && (
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: themeColors[4] }}
                >
                  {resumeData.profileInfo.summary}
                </p>
              )}
              <div
                className="mt-4 h-px w-full"
                style={{ backgroundColor: themeColors[2], opacity: 0.3 }}
              ></div>
            </div>
          </div>

          {/* Work Experience */}
          {resumeData.workExperience &&
            resumeData.workExperience.length > 0 && (
              <div className="mb-6">
                <Title
                  text="Kinh nghiệm làm việc"
                  icon={<LuBriefcase className="w-4 h-4" />}
                  color={themeColors[3]}
                />
                <div>
                  {resumeData.workExperience?.map((exp, index) => (
                    <TimelineItem
                      key={`work_experience_${index}`}
                      title={exp.role}
                      subtitle={exp.company}
                      date={`${formatYearMonth(
                        exp.startDate
                      )} - ${formatYearMonth(exp.endDate)}`}
                      description={exp.description}
                      color={themeColors[3]}
                      textColor={themeColors[4]}
                    />
                  ))}
                </div>
              </div>
            )}

          {/* Education */}
          {resumeData.education && resumeData.education.length > 0 && (
            <div className="mb-6">
              <Title
                text="Học vấn"
                icon={<LuGraduationCap className="w-4 h-4" />}
                color={themeColors[3]}
              />
              <div>
                {resumeData.education?.map((edu, index) => (
                  <TimelineItem
                    key={`education_${index}`}
                    title={edu.degree}
                    subtitle={edu.institution}
                    date={`${formatYearMonth(
                      edu.startDate
                    )} - ${formatYearMonth(edu.endDate)}`}
                    color={themeColors[3]}
                    textColor={themeColors[4]}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {resumeData.projects && resumeData.projects.some((p) => p.title) && (
            <div className="mb-6">
              <Title
                text="Dự án"
                icon={<LuCode className="w-4 h-4" />}
                color={themeColors[3]}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resumeData.projects?.map((project, index) =>
                  project.title ? (
                    <div
                      key={`project_${index}`}
                      className="p-4 rounded-lg"
                      style={{ backgroundColor: themeColors[0] }}
                    >
                      <h3 className="font-bold text-base mb-1">
                        {project.title}
                      </h3>
                      <p className="text-sm mb-2">{project.description}</p>
                      <div className="flex items-center gap-3 mt-2">
                        {project.github && (
                          <ActionLink
                            icon={<FaGithub />}
                            link={project.github}
                            bgColor={themeColors[2]}
                          />
                        )}
                        {project.liveDemo && (
                          <ActionLink
                            icon={<GoLink />}
                            link={project.liveDemo}
                            bgColor={themeColors[2]}
                          />
                        )}
                      </div>
                    </div>
                  ) : null
                )}
              </div>
            </div>
          )}

          {/* Certifications */}
          {resumeData.certifications &&
            resumeData.certifications.length > 0 && (
              <div>
                <Title
                  text="Chứng chỉ"
                  icon={<LuAward className="w-4 h-4" />}
                  color={themeColors[3]}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {resumeData.certifications?.map((cert, index) => (
                    <div
                      key={`cert_${index}`}
                      className="p-3 rounded-md"
                      style={{ backgroundColor: themeColors[1] }}
                    >
                      <h3
                        className="font-medium text-sm"
                        style={{ color: themeColors[4] }}
                      >
                        {cert.name}
                      </h3>
                      <div className="flex items-center justify-between mt-1">
                        <p
                          className="text-xs"
                          style={{ color: themeColors[3] }}
                        >
                          {cert.issuer}
                        </p>
                        <p
                          className="text-xs px-2 py-0.5 rounded-md"
                          style={{
                            backgroundColor: themeColors[3],
                            color: "#FFFFFF",
                          }}
                        >
                          {cert.year}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default TemplateSix;
