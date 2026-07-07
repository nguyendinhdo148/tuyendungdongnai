import type { Resume } from "@/types/resume";
import { useEffect, useRef, useState } from "react";
import { formatYearMonth } from "../helpers/helper";

interface Props {
  resumeData: Resume;
  colorPalette: string[];
  containerWidth: number;
}

const DEFAULT_THEME = ["#EBFDFF", "#A1F4FD", "#CEFAFE", "#00B8DB", "#111111"];

const SectionHeader = ({ title, color }: { title: string; color: string }) => (
  <h2
    className="text-[15px] font-bold uppercase border-b-2 mb-3 mt-5 pb-1 tracking-wider"
    style={{ borderColor: color, color: color }}
  >
    {title}
  </h2>
);

const TemplateSeven = ({ resumeData, colorPalette, containerWidth }: Props) => {
  const themeColors: string[] =
    colorPalette?.length > 0 ? colorPalette : DEFAULT_THEME;
  // Dùng màu tối nhất trong palette làm màu chủ đạo cho text/border để giữ nét cổ điển
  const mainColor = themeColors[4] || "#111111";

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

  // Tạo chuỗi thông tin liên hệ
  const contactList = [
    resumeData.contactInfo?.location,
    resumeData.contactInfo?.phoneNumber,
    resumeData.contactInfo?.email,
    resumeData.contactInfo?.linkedin,
    resumeData.contactInfo?.github,
    resumeData.contactInfo?.website,
  ].filter(Boolean);

  return (
    <div
      ref={resumeRef}
      className="p-10 bg-white text-gray-900 leading-relaxed"
      style={{
        // Sử dụng font Times New Roman chuẩn mực để không bị lỗi tiếng Việt
        fontFamily: '"Times New Roman", Times, serif',
        transform: containerWidth > 0 ? `scale(${scale})` : "none",
        transformOrigin: "left top",
        width: containerWidth > 0 ? `${baseWith}px` : "auto",
        height: "auto",
      }}
    >
      {/* HEADER: Name & Contact Info */}
      <div className="text-center mb-6">
        <h1
          className="text-3xl font-bold uppercase tracking-wider mb-1"
          style={{ color: mainColor }}
        >
          {resumeData?.profileInfo?.fullName?.normalize("NFC")}
        </h1>
        {resumeData?.profileInfo?.designation && (
          <p className="text-[15px] italic mb-2 text-gray-800">
            {resumeData.profileInfo.designation.normalize("NFC")}
          </p>
        )}
        <div className="text-[13px] flex flex-wrap justify-center items-center gap-x-2 text-gray-700">
          {contactList.map((item, index) => (
            <span key={index} className="flex items-center gap-x-2">
              <span>{item?.normalize("NFC")}</span>
              {index < contactList.length - 1 && <span>|</span>}
            </span>
          ))}
        </div>
      </div>

      {/* SUMMARY */}
      {resumeData.profileInfo?.summary && (
        <div>
          <SectionHeader title="TÓM TẮT" color={mainColor} />
          <p className="text-[14px] leading-relaxed text-justify">
            {resumeData.profileInfo.summary.normalize("NFC")}
          </p>
        </div>
      )}

      {/* EDUCATION */}
      {resumeData.education && resumeData.education.length > 0 && (
        <div>
          <SectionHeader title="HỌC VẤN" color={mainColor} />
          {resumeData.education.map((edu, index) => (
            <div key={index} className="mb-3">
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-[14px]">
                  {edu.institution?.normalize("NFC")}
                </span>
                <span className="text-[13px] whitespace-nowrap ml-4">
                  {formatYearMonth(edu.startDate)} -{" "}
                  {formatYearMonth(edu.endDate)}
                </span>
              </div>
              <div className="text-[14px] italic mt-0.5">
                {edu.degree?.normalize("NFC")}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* EXPERIENCE */}
      {resumeData.workExperience && resumeData.workExperience.length > 0 && (
        <div>
          <SectionHeader title="KINH NGHIỆM LÀM VIỆC" color={mainColor} />
          {resumeData.workExperience.map((exp, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-[14px]">
                  {exp.company?.normalize("NFC")}
                </span>
                <span className="text-[13px] whitespace-nowrap ml-4">
                  {formatYearMonth(exp.startDate)} -{" "}
                  {formatYearMonth(exp.endDate)}
                </span>
              </div>
              <div className="text-[14px] italic mt-0.5 mb-1.5">
                {exp.role?.normalize("NFC")}
              </div>
              <p className="text-[14px] leading-relaxed whitespace-pre-line pl-4">
                {exp.description?.normalize("NFC")}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* PROJECTS */}
      {resumeData.projects && resumeData.projects.length > 0 && (
        <div>
          <SectionHeader title="DỰ ÁN" color={mainColor} />
          {resumeData.projects.map((project, index) => {
            if (!project.title) return null;
            return (
              <div key={index} className="mb-3">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-[14px]">
                    {project.title?.normalize("NFC")}
                  </span>
                  <div className="text-[13px] flex gap-3 ml-4">
                    {project.liveDemo && (
                      <a href={project.liveDemo} className="underline text-blue-800">
                        Live Demo
                      </a>
                    )}
                    {project.github && (
                      <a href={project.github} className="underline text-blue-800">
                        GitHub
                      </a>
                    )}
                  </div>
                </div>
                <p className="text-[14px] leading-relaxed whitespace-pre-line pl-4 mt-1">
                  {project.description?.normalize("NFC")}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* SKILLS & LANGUAGES */}
      {((resumeData.skills && resumeData.skills.length > 0) ||
        (resumeData.languages && resumeData.languages.length > 0)) && (
        <div>
          <SectionHeader title="KỸ NĂNG & NGOẠI NGỮ" color={mainColor} />
          
          {resumeData.skills && resumeData.skills.length > 0 && (
            <div className="text-[14px] mb-2">
              <span className="font-bold">Kỹ năng chuyên môn: </span>
              <span>
                {resumeData.skills
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  .map((skill: any) => (skill.name || skill)?.normalize("NFC"))
                  .join(", ")}
              </span>
            </div>
          )}

          {resumeData.languages && resumeData.languages.length > 0 && (
            <div className="text-[14px] mb-2">
              <span className="font-bold">Ngoại ngữ: </span>
              <span>
                {resumeData.languages
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  .map((lang: any) => (lang.name || lang)?.normalize("NFC"))
                  .join(", ")}
              </span>
            </div>
          )}
        </div>
      )}

      {/* CERTIFICATIONS */}
      {resumeData.certifications && resumeData.certifications.length > 0 && (
        <div>
          <SectionHeader title="CHỨNG CHỈ" color={mainColor} />
          {resumeData.certifications.map((cert, index) => (
            <div key={index} className="flex justify-between items-baseline text-[14px] mb-1.5">
              <span>
                <span className="font-bold">{cert.name?.normalize("NFC")}</span> — {cert.issuer?.normalize("NFC")}
              </span>
              <span className="text-[13px] whitespace-nowrap ml-4">{cert.year?.normalize("NFC")}</span>
            </div>
          ))}
        </div>
      )}

      {/* INTERESTS */}
      {resumeData.interests &&
        resumeData.interests.length > 0 &&
        resumeData.interests[0] !== "" && (
          <div>
            <SectionHeader title="SỞ THÍCH" color={mainColor} />
            <div className="text-[14px]">
              {resumeData.interests.filter(Boolean).map(i => i.normalize("NFC")).join(", ")}
            </div>
          </div>
        )}
    </div>
  );
};

export default TemplateSeven;