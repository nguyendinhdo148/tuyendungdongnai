import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, MapPin, Phone } from "lucide-react";
import { GrGithub, GrLinkedin } from "react-icons/gr";
import { FaFacebook } from "react-icons/fa";
import { CgWebsite } from "react-icons/cg";

interface ContactInfo {
  location?: string;
  email?: string;
  phoneNumber?: string;
  linkedin?: string;
  github?: string;
  facebook?: string;
  website?: string;
}

interface ContactInfoFormProps {
  contactInfo: ContactInfo;
  updateSection: (field: keyof ContactInfo, value: string) => void;
}
const ContactInfoForm = ({
  contactInfo,
  updateSection,
}: ContactInfoFormProps) => {
  return (
    <div className="px-5 pt-5">
      <h2 className="text-lg font-semibold text-gray-900">
        Thông tin liên hệ
      </h2>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Address (full width) */}
        <div className="md:col-span-2">
          <Label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <MapPin size={14} />
            Địa chỉ
          </Label>
          <Input
            value={contactInfo.location || ""}
            onChange={(e) => updateSection("location", e.target.value)}
            placeholder="Short Address"
            type="text"
            className="mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Email */}
        <div>
          <Label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Mail size={14} />
            Email
          </Label>
          <Input
            value={contactInfo.email || ""}
            onChange={(e) => updateSection("email", e.target.value)}
            placeholder="your-email@gmail.com"
            type="text"
            className="mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Phone Number */}
        <div>
          <Label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Phone size={14} />
            Số điện thoại
          </Label>
          <Input
            value={contactInfo.phoneNumber || ""}
            onChange={(e) => updateSection("phoneNumber", e.target.value)}
            placeholder="Your phone number..."
            type="text"
            className="mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* LinkedIn */}
        <div>
          <Label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <GrLinkedin size={14} />
            LinkedIn
          </Label>
          <Input
            value={contactInfo.linkedin || ""}
            onChange={(e) => updateSection("linkedin", e.target.value)}
            placeholder="https://www.linkedin.com/in/your-linkedin/"
            type="text"
            className="mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Github */}
        <div>
          <Label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <GrGithub size={14} />
            GitHub
          </Label>
          <Input
            value={contactInfo.github || ""}
            onChange={(e) => updateSection("github", e.target.value)}
            placeholder="https://github.com/your-github/"
            type="text"
            className="mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Facebook */}
        <div>
          <Label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <FaFacebook size={14} />
            Facebook
          </Label>
          <Input
            value={contactInfo.facebook || ""}
            onChange={(e) => updateSection("facebook", e.target.value)}
            placeholder="https://www.facebook.com/your-facebook/"
            type="text"
            className="mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Portfolio (full width) */}
        <div>
          <Label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <CgWebsite size={14} />
            Portfolio / Website
          </Label>
          <Input
            value={contactInfo.website || ""}
            onChange={(e) => updateSection("website", e.target.value)}
            placeholder="https://yourwebsite.com"
            type="text"
            className="mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
};

export default ContactInfoForm;
