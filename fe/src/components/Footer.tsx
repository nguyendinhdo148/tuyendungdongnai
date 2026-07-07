import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { fadeIn, fadeInUp, staggerContainer } from "./../framer-motion-config";
import { Mail, Phone, MapPin, ArrowRight, Heart } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Đã liên kết với các route có thật trong App.tsx
  const footerLinks = [
    {
      title: "Dành cho Ứng viên",
      links: [
        { name: "Tìm việc làm", href: "/jobs" },
        { name: "Việc làm đã lưu", href: "/saved-jobs" },
        { name: "Việc làm đã ứng tuyển", href: "/applied-jobs" },
        { name: "Cập nhật Hồ sơ", href: "/profile" },
      ],
    },
    {
      title: "Hồ sơ & CV",
      links: [
        { name: "Tạo CV miễn phí", href: "/resume" },
        { name: "Quản lý CV", href: "/resume/dashboard-resume" },
        { name: "Đánh giá CV bằng AI", href: "/tools/resume-review" },
      ],
    },
    {
      title: "Khám phá bản thân",
      links: [
        { name: "Trắc nghiệm MBTI", href: "/tools/mbti" },
        { name: "Trắc nghiệm Đa trí tuệ (MI)", href: "/tools/mi" },
        { name: "Blog nghề nghiệp", href: "/blog" },
      ],
    },
    {
      title: "Công cụ tài chính",
      links: [
        { name: "Tính lương Gross - Net", href: "/tools/gross-net" },
        { name: "Tính Thuế TNCN", href: "/tools/personal-tax" },
        { name: "Tính Bảo hiểm xã hội", href: "/tools/social-insurance" },
        { name: "Tính Lãi kép", href: "/tools/compound-interest" },
      ],
    },
  ];

  // Chỉ giữ lại mxh thật, link thật (Thêm logo Zalo chuẩn)
  const socialMedia = [
    { 
      name: "Facebook", 
      icon: "M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z", 
      color: "from-[#4267B2] to-[#365899]", 
      href: "https://www.facebook.com/nguyen.inh.o.284334/" 
    },
    { 
      name: "Instagram", 
      icon: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z", 
      color: "from-[#E1306C] to-[#C13584]", 
      href: "https://www.instagram.com/doo_6823/" 
    },
    { 
      name: "Zalo", 
      icon: "M21.05 10.635c0-4.996-4.57-9.05-10.203-9.05-5.632 0-10.202 4.054-10.202 9.05 0 2.57 1.218 4.887 3.167 6.529-.395 1.637-1.125 3.327-1.144 3.38-.027.085-.027.18 0 .265.027.086.088.156.166.195.048.024.1.036.151.036.035 0 .07-.006.104-.017 1.83-.559 3.65-1.5 5.032-2.316 1.05.293 2.164.448 3.3.448 5.632 0 10.203-4.054 10.203-9.05zm-14.444 2.825a.81.81 0 01-.81-.81v-3.792a.81.81 0 011.62 0v2.982h1.618a.81.81 0 010 1.62H6.606zm4.99 0a.81.81 0 01-.81-.81v-3.792a.81.81 0 111.62 0v3.792a.81.81 0 01-.81.81zm2.348-1.748c.118-.118.184-.278.184-.445 0-.166-.066-.326-.184-.444l-1.39-1.39a.81.81 0 111.146-1.146l1.39 1.39c.424.424.658 1.002.658 1.59 0 .589-.234 1.167-.658 1.59l-1.39 1.39a.81.81 0 01-1.146-1.146l1.39-1.39zm3.565 1.748h-1.618a.81.81 0 010-1.62h1.618a.81.81 0 010 1.62z", 
      color: "from-[#0068FF] to-[#004BB5]", 
      href: "https://zalo.me/0869122385" 
    },
  ];

  // Cập nhật thông tin liên hệ chuẩn
  const contactInfo = [
    { icon: Mail, text: "tuyendungdongnai321@gmail.com", href: "mailto:tuyendungdongnai321@gmail.com" },
    { icon: Phone, text: "0869 122 385", href: "tel:+84869122385" },
    { icon: MapPin, text: "Đồng Nai, Việt Nam", href: "#" },
  ];

  return (
    <motion.footer
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={staggerContainer}
      className="relative bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/30 overflow-hidden pt-16 pb-8"
    >
      <div className="container mx-auto px-4 sm:px-6">
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-12">
          
          {/* Brand & Contact Column */}
          <motion.div variants={fadeInUp} className="lg:col-span-4 space-y-6">
            <Link to="/">
              <h2 className="text-2xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Tuyển Dụng Đồng Nai
              </h2>
            </Link>
            <p className="text-gray-600 text-sm leading-relaxed">
              Kết nối nhân tài với các doanh nghiệp hàng đầu tại Đồng Nai và khu vực lân cận. Nâng tầm sự nghiệp của bạn ngay hôm nay.
            </p>
            
            <div className="space-y-3 pt-2">
              {contactInfo.map((contact, idx) => (
                <a key={idx} href={contact.href} className="flex items-center gap-3 text-sm text-gray-600 hover:text-blue-600 transition-colors group">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <contact.icon className="w-4 h-4" />
                  </div>
                  <span className="font-medium">{contact.text}</span>
                </a>
              ))}
            </div>
          </motion.div>

          {/* Links Grid */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {footerLinks.map((column) => (
              <div key={column.title} className="space-y-4">
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">{column.title}</h4>
                <ul className="space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link.name}>
                      <Link to={link.href} className="text-sm text-gray-600 hover:text-blue-600 transition-colors flex items-center group">
                        <ArrowRight className="w-3 h-3 mr-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <motion.div variants={fadeIn} className="border-t border-gray-200 pt-8 mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
          <p className="text-xs text-gray-500 font-medium">
            © {currentYear} Tuyển Dụng Đồng Nai. All rights reserved.
          </p>
          
          <div className="flex items-center gap-4">
            {socialMedia.map((s, i) => (
              <a 
                key={i} 
                href={s.href} 
                target="_blank" 
                rel="noopener noreferrer" 
                className={`w-8 h-8 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center text-white hover:-translate-y-1 transition-transform shadow-sm`}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d={s.icon} />
                </svg>
              </a>
            ))}
          </div>
        </motion.div>
        
        {/* Heart Tag */}
        <div className="flex justify-center mt-8">
          <div className="flex items-center gap-2 text-[10px] sm:text-xs font-medium text-gray-400 bg-white/50 px-4 py-1.5 rounded-full border border-gray-100">
            <Heart className="w-3 h-3 text-red-500 fill-current" />
            Đồng hành cùng sự nghiệp của bạn
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;