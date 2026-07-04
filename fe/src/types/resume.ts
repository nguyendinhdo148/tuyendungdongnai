export interface Resume {
  _id?: string;
  // userId: string;
  title: string;
  thumbnailLink?: string;
  template?: {
    theme?: string;
    colorPalette?: string[];
  };
  profileInfo?: {
    profilePreviewUrl?: string;
    fullName?: string;
    designation?: string;
    summary?: string;
  };
  contactInfo?: {
    email?: string;
    phoneNumber?: string;
    location?: string;
    linkedin?: string;
    github?: string;
    facebook?: string;
    website?: string;
  };
  workExperience?: Array<{
    company: string;
    role: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  education?: Array<{
    degree: string;
    institution: string;
    startDate: string;
    endDate: string;
  }>;
  skills?: Array<{
    name: string;
    progress: number;
  }>;
  projects?: Array<{
    title: string;
    description: string;
    github?: string;
    liveDemo?: string;
  }>;
  certifications?: Array<{
    name: string;
    issuer: string;
    year: string;
  }>;
  languages?: Array<{
    name: string;
    progress: number;
  }>;
  interests?: string[];
  createdAt?: string;
  updatedAt?: string;
}
