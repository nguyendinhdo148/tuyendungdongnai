import TEMPLATE_ONE from "/TemplateOne.jpg";
import TEMPLATE_TWO from "/TemplateTwo.jpg";
import TEMPLATE_THREE from "/TemplateThree.jpg";
import TEMPLATE_FOUR from "/TemplateFour.jpg";
import TEMPLATE_FIVE from "/TemplateFive.jpg";
import TEMPLATE_SIX from "/TemplateSix.jpg";

interface Resume {
  // userId: string;
  title: string;
  thumbnailLink: string;
  template: {
    theme: string;
    colorPalette: string[];
  };
  profileInfo: {
    profileImg: File | null;
    profilePreviewUrl: string;
    fullName: string;
    designation: string;
    summary: string;
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
}

export const resumeTemplates = [
  {
    id: "01",
    thumbnailImg: TEMPLATE_ONE,
    colorPaletteCode: "themeOne",
  },
  {
    id: "02",
    thumbnailImg: TEMPLATE_TWO,
    colorPaletteCode: "themeTwo",
  },
  {
    id: "03",
    thumbnailImg: TEMPLATE_THREE,
    colorPaletteCode: "themeThree",
  },
  {
    id: "04",
    thumbnailImg: TEMPLATE_FOUR,
    colorPaletteCode: "themeFour",
  },
  {
    id: "05",
    thumbnailImg: TEMPLATE_FIVE,
    colorPaletteCode: "themeFive",
  },
  {
    id: "06",
    thumbnailImg: TEMPLATE_SIX,
    colorPaletteCode: "themeSix",
  },
];

export const themeColorPalette = {
  themeOne: [
    ["#EBFDFF", "#A1F4FD", "#CEFAFE", "#00B8DB", "#4A5565"],
    ["#E9FBF8", "#B4EFE7", "#93E2DA", "#2AC9A0", "#3D4C5A"],
    ["#F5F4FF", "#E0DBFF", "#C9C2F8", "#8579D1", "#4B4B5C"],
    ["#F0FAFF", "#D6F0FF", "#AFDEFF", "#3399FF", "#445361"],
    ["#FFFFF7", "#FFFEEC", "#FAC6D4", "#F6729C", "#5A5A5A"],
    ["#F9FAFB", "#E4E7EB", "#CBD5E0", "#F79CF5", "#2D3748"],
    ["#F4FFFD", "#D3FDF2", "#B0E9D4", "#34C79D", "#384C48"],
    ["#E3F2FD", "#90CAF9", "#42A5F5", "#1565C0", "#1E2A38"],
    ["#E8F5E9", "#A5D6A7", "#66BB6A", "#2E7D32", "#263238"],
    ["#ECEFF1", "#CFD8DC", "#90A4AE", "#607D8B", "#37474F"],
    ["#FFF8E1", "#FFECB3", "#FFC107", "#FF6F00", "#3E2723"],
    ["#F3E5F5", "#CE93D8", "#AB47BC", "#6A1B9A", "#311B92"],
    ["#FFF3E0", "#FFCC80", "#FF9800", "#EF6C00", "#4E342E"],
    ["#E0F7FA", "#80DEEA", "#26C6DA", "#00838F", "#004D40"],
  ],
};

export const DUMMY_RESUME_DATA: Resume = {
  title: "Sơ yếu lý lịch",
  thumbnailLink: "",
  template: {
    theme: "themeOne",
    colorPalette: ["#EBFDFF", "#A1F4FD", "#CEFAFE", "#00B8DB", "#4A5565"],
  },
  profileInfo: {
    profileImg: null,
    profilePreviewUrl: "",
    fullName: "David Nguyễn",
    designation: "Lập trình viên Fullstack",
    summary:
      "Lập trình viên Fullstack năng động và hướng kết quả với hơn 5 năm kinh nghiệm xây dựng các ứng dụng web mở rộng bằng React, Node.js và TypeScript. Thành thạo trong thiết kế giao diện, phát triển backend và quản lý cơ sở dữ liệu. Có khả năng làm việc nhóm tốt, đam mê viết mã sạch, phát triển theo Agile và học hỏi không ngừng.",
  },
  contactInfo: {
    email: "david.nguyen@example.com",
    phoneNumber: "+1 (234) 567-8901",
    location: "San Francisco, Mỹ",
    linkedin: "https://www.linkedin.com/in/davidnguyen",
    github: "https://github.com/davidnguyen",
    facebook: "https://www.facebook.com/davidnguyen",
    website: "https://davidnguyen.dev",
  },
  workExperience: [
    {
      company: "TechWave Solutions",
      role: "Senior Fullstack Developer",
      startDate: "2020-09-01",
      endDate: "2024-06-01",
      description:
        "- Dẫn dắt phát triển cổng thông tin khách hàng bằng React, Node.js và PostgreSQL.\n- Tích hợp API REST và GraphQL cho trao đổi dữ liệu thời gian thực.\n- Tối ưu hiệu suất ứng dụng tăng 30% thông qua các kỹ thuật tối ưu và refactor mã.",
    },
    {
      company: "Innovatech Labs",
      role: "Fullstack Developer",
      startDate: "2018-09-01",
      endDate: "2020-06-01",
      description:
        "- Xây dựng giao diện web phản hồi bằng React và Redux.\n- Thiết kế dịch vụ backend với Express.js và MongoDB.\n- Phối hợp với nhóm QA và DevOps để đảm bảo chất lượng phần mềm và quy trình CI/CD mượt mà.",
    },
  ],
  education: [
    {
      degree: "Cử nhân Kỹ thuật phần mềm",
      institution: "Đại học California, Berkeley",
      startDate: "2014-09-01",
      endDate: "2018-06-01",
    },
  ],
  skills: [
    { name: "JavaScript", progress: 90 },
    { name: "TypeScript", progress: 85 },
    { name: "React", progress: 85 },
    { name: "Node.js", progress: 85 },
    { name: "MongoDB", progress: 75 },
    { name: "PostgreSQL", progress: 70 },
    { name: "Git", progress: 80 },
  ],
  projects: [
    {
      title: "TaskManager Pro",
      description:
        "Một ứng dụng quản lý công việc đầy đủ tính năng với đăng nhập, cập nhật thời gian thực và phân quyền người dùng. Xây dựng với MERN stack.",
      github: "https://github.com/davidnguyen/taskmanager-pro",
      liveDemo: "https://taskmanager.davidnguyen.dev",
    },
    {
      title: "DevConnect",
      description:
        "Nền tảng mạng xã hội dành cho lập trình viên để chia sẻ ý tưởng và hợp tác dự án. Bao gồm tính năng chat, bài viết blog và bảng dự án.",
      github: "https://github.com/davidnguyen/devconnect",
      liveDemo: "https://devconnect.davidnguyen.dev",
    },
  ],
  certifications: [
    {
      name: "Phát triển Web Fullstack",
      issuer: "freeCodeCamp",
      year: "2022",
    },
    {
      name: "Chứng chỉ React Developer",
      issuer: "Coursera - Meta",
      year: "2023",
    },
  ],
  languages: [
    { name: "Tiếng Anh", progress: 90 },
    { name: "Tiếng Nhật", progress: 40 },
  ],
  interests: ["Mã nguồn mở", "Viết blog công nghệ", "Leo núi", "Chơi game"],
};
