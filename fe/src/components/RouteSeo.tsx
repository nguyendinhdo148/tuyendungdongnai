import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

const SITE_URL = "https://www.tuyendungdongnai.com";

type PageMetadata = {
  title: string;
  description: string;
  indexable?: boolean;
  canonicalPath?: string;
};

const publicPages: Record<string, PageMetadata> = {
  "/": {
    title: "Tuyển Dụng Đồng Nai - Việc Làm Mới Nhất Tại Đồng Nai",
    description:
      "Tìm việc làm mới nhất tại Đồng Nai và Bình Phước. Khám phá cơ hội tuyển dụng đa ngành, việc làm tại Đồng Xoài và các khu công nghiệp.",
  },
  "/jobs": {
    title: "Tìm Việc Làm Mới Nhất Tại Đồng Nai, Bình Phước",
    description:
      "Khám phá việc làm mới nhất tại Đồng Nai, Bình Phước và Đồng Xoài. Lọc công việc theo ngành nghề, địa điểm và mức lương phù hợp.",
  },
  "/browse": {
    title: "Khám Phá Việc Làm | Tuyển Dụng Đồng Nai",
    description:
      "Khám phá và lọc các công việc đang tuyển dụng tại Đồng Nai và Bình Phước.",
    indexable: false,
    canonicalPath: "/jobs",
  },
  "/blog": {
    title: "Blog Nghề Nghiệp Và Kinh Nghiệm Tìm Việc",
    description:
      "Đọc bài viết về nghề nghiệp, kỹ năng, kinh nghiệm tìm việc và phát triển sự nghiệp từ cộng đồng Tuyển Dụng Đồng Nai.",
  },
  "/resume": {
    title: "Tạo CV Online Chuyên Nghiệp Miễn Phí",
    description:
      "Tạo CV xin việc online với các mẫu chuyên nghiệp, dễ chỉnh sửa và phù hợp để ứng tuyển tại Đồng Nai, Bình Phước.",
  },
  "/resume/learn-more": {
    title: "Hướng Dẫn Tạo CV Xin Việc | Tuyển Dụng Đồng Nai",
    description:
      "Tìm hiểu cách tạo CV rõ ràng, chuyên nghiệp và làm nổi bật kinh nghiệm, kỹ năng khi ứng tuyển.",
  },
  "/tools/mbti": {
    title: "Trắc Nghiệm MBTI Và Khám Phá Nhóm Tính Cách",
    description:
      "Khám phá 16 nhóm tính cách MBTI, điểm mạnh và gợi ý nghề nghiệp để hiểu thêm về bản thân và định hướng công việc.",
  },
  "/tools/mi": {
    title: "Khám Phá Thuyết Đa Trí Tuệ MI",
    description:
      "Tìm hiểu các dạng trí thông minh theo thuyết MI và khám phá thế mạnh có thể hỗ trợ học tập, công việc và phát triển cá nhân.",
  },
  "/tools/gross-net": {
    title: "Công Cụ Tính Lương Gross Sang Net",
    description:
      "Ước tính lương thực nhận từ lương Gross sau khi tính các khoản bảo hiểm và thuế thu nhập cá nhân.",
  },
  "/tools/personal-tax": {
    title: "Công Cụ Tính Thuế Thu Nhập Cá Nhân",
    description:
      "Ước tính thuế thu nhập cá nhân phải nộp theo thu nhập và các khoản giảm trừ.",
  },
  "/tools/compound-interest": {
    title: "Công Cụ Tính Lãi Kép",
    description:
      "Ước tính giá trị khoản tiết kiệm hoặc đầu tư theo thời gian với công cụ tính lãi kép.",
  },
  "/tools/social-insurance": {
    title: "Công Cụ Tính Bảo Hiểm Xã Hội",
    description:
      "Tham khảo cách ước tính các khoản bảo hiểm xã hội dựa trên mức lương và thông tin của bạn.",
  },
  "/tools/unemployment-insurance": {
    title: "Công Cụ Tính Bảo Hiểm Thất Nghiệp",
    description:
      "Ước tính quyền lợi bảo hiểm thất nghiệp dựa trên thời gian đóng và mức lương tham gia.",
  },
  "/tools/saving-plan": {
    title: "Công Cụ Lập Kế Hoạch Tiết Kiệm",
    description:
      "Lập kế hoạch tiết kiệm và theo dõi mục tiêu tài chính theo khoản đóng góp và thời gian dự kiến.",
  },
};

const mbtiTypes: Record<string, string> = {
  infp: "Người lý tưởng hóa",
  infj: "Người che chở",
  intj: "Nhà kiến tạo",
  intp: "Nhà tư duy",
  istj: "Người trách nhiệm",
  isfj: "Người bảo vệ",
  istp: "Người kỹ thuật",
  isfp: "Người nghệ sĩ",
  estp: "Người năng động",
  esfp: "Người trình diễn",
  enfp: "Người truyền cảm hứng",
  entp: "Người nhìn xa",
  estj: "Người điều hành",
  esfj: "Người quan tâm",
  enfj: "Người dẫn dắt",
  entj: "Nhà lãnh đạo",
};

const privatePage = (title: string): PageMetadata => ({
  title,
  description: "Tuyển Dụng Đồng Nai.",
  indexable: false,
});

function getPageMetadata(pathname: string): PageMetadata {
  const path =
    pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  const staticPage = publicPages[path];
  if (staticPage) return staticPage;

  if (path.startsWith("/job/detail/")) {
    return {
      title: "Chi Tiết Việc Làm | Tuyển Dụng Đồng Nai",
      description:
        "Xem thông tin tuyển dụng, yêu cầu công việc và quyền lợi tại Đồng Nai, Bình Phước.",
    };
  }
  if (path.startsWith("/company/detail/")) {
    return {
      title: "Thông Tin Công Ty | Tuyển Dụng Đồng Nai",
      description:
        "Tìm hiểu thông tin doanh nghiệp và các vị trí đang tuyển dụng.",
    };
  }
  if (path.startsWith("/blog/detail/")) {
    return {
      title: "Bài Viết Nghề Nghiệp | Tuyển Dụng Đồng Nai",
      description:
        "Đọc bài viết chia sẻ kinh nghiệm nghề nghiệp và phát triển sự nghiệp.",
    };
  }

  const mbtiMatch = path.match(/^\/tools\/mbti\/tinh-cach\/([a-z]{4})$/);
  if (mbtiMatch) {
    const type = mbtiMatch[1].toUpperCase();
    const name = mbtiTypes[mbtiMatch[1]];
    return {
      title: `Tính Cách ${type}: ${name} | Trắc Nghiệm MBTI`,
      description: `Khám phá đặc điểm, thế mạnh và gợi ý nghề nghiệp phù hợp với nhóm tính cách MBTI ${type} (${name}).`,
    };
  }

  if (
    path === "/tools/mbti/test" ||
    path === "/tools/mbti/result" ||
    path === "/tools/mi/test" ||
    path === "/tools/mi/result" ||
    path === "/tools/resume-review"
  ) {
    return privatePage("Công Cụ Cá Nhân | Tuyển Dụng Đồng Nai");
  }

  return privatePage("Tuyển Dụng Đồng Nai");
}

const RouteSeo = () => {
  const location = useLocation();
  const metadata = getPageMetadata(location.pathname);
  const isFilteredJobsPage =
    location.pathname.replace(/\/+$/, "") === "/jobs" &&
    Boolean(location.search);
  const isIndexable = metadata.indexable !== false && !isFilteredJobsPage;
  const canonicalPath = metadata.canonicalPath ?? location.pathname;
  const normalizedCanonicalPath =
    canonicalPath.length > 1 ? canonicalPath.replace(/\/+$/, "") : canonicalPath;
  const canonicalUrl = `${SITE_URL}${normalizedCanonicalPath}`;

  return (
    <Helmet>
      <title>{metadata.title}</title>
      <meta name="description" content={metadata.description} />
      <meta name="robots" content={isIndexable ? "index, follow" : "noindex, follow"} />
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:title" content={metadata.title} />
      <meta property="og:description" content={metadata.description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="Tuyển Dụng Đồng Nai" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metadata.title} />
      <meta name="twitter:description" content={metadata.description} />
    </Helmet>
  );
};

export default RouteSeo;
