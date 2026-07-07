import { Search, Clock, Plus, LayoutGrid, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../shared/Navbar";
import Footer from "../Footer";
import { useDispatch, useSelector } from "react-redux";
import { API } from "@/utils/constant";
import axios from "axios";
import { setAllBlogs } from "@/redux/blogSlice";
import { RootState } from "@/redux/store";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { stripHtmlTags } from "../helpers/stripHTML";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { SkeletonLandingPageBlog } from "./components/skeletons/SkeletonLandingPageBlog";
import { BLOG_CATEGORIES } from "@/lib/BlogCategory";

// Banner slide data
const blogBanners = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1200&auto=format&fit=crop",
    title: "Chia sẻ kinh nghiệm nghề nghiệp",
    subtitle: "Những bài học quý giá từ chuyên gia",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop",
    title: "Phát triển kỹ năng mềm",
    subtitle: "Hành trình trở thành phiên bản tốt hơn",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1200&auto=format&fit=crop",
    title: "Xu hướng nghề nghiệp tương lai",
    subtitle: "Cập nhật những thay đổi mới nhất",
  },
];

const LandingPageBlog = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Slider State
  const [currentSlide, setCurrentSlide] = useState(0);

  // Fetch all blogs
  useEffect(() => {
    const fetchAllBlogs = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`${API}/blog/all-blogs`);
        dispatch(setAllBlogs(res.data.blogs));
      } catch (err) {
        console.error("Lỗi khi fetch blogs:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllBlogs();
  }, [dispatch]);

  // Auto-play Slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % blogBanners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const { allBlogs } = useSelector((store: RootState) => store.blog);
  const { user } = useSelector((store: RootState) => store.auth);

  const [visibleCount, setVisibleCount] = useState(8);

  const filteredPosts = allBlogs.filter((post) => {
    const matchesCategory =
      activeCategory === "all" || post.category === activeCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category.toLowerCase().includes(searchQuery.toLowerCase());

    return post.approval === "approved" && matchesCategory && matchesSearch;
  });

  const postsToShow = filteredPosts.slice(0, visibleCount);

  if (isLoading) {
    return <SkeletonLandingPageBlog />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Hero Section - Chia đôi: Nội dung bên trái, Slide bên phải */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12 md:mb-16 items-center">
          
          {/* CỘT TRÁI: Nội dung Hero */}
          <div className="order-2 lg:order-1">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 font-semibold text-xs mb-4 border border-blue-200/50 shadow-sm">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
              Mới: Tính năng AI được tích hợp
              <div className="ml-2 px-2 py-0.5 bg-orange-100 text-orange-600 rounded-full text-[10px] font-bold">
                HOT
              </div>
            </div>

            {/* Tiêu đề */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-3 leading-tight">
              <span className="text-gray-900">Góc chia sẻ</span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 bg-clip-text text-transparent">
                nghề nghiệp
              </span>{" "}
              <span className="text-gray-900">của bạn</span>
            </h1>

            {/* Mô tả */}
            <p className="text-sm md:text-base text-gray-600 max-w-lg leading-relaxed font-medium mb-5">
              Từ góc nhìn cá nhân, bạn có thể tạo nên thay đổi cho cộng đồng.
            </p>

            {/* Action Buttons */}
            {user?.role === "student" && (
              <div className="flex flex-wrap gap-3 mb-5">
                <Link to="/blog/manager-blogs">
                  <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm text-sm">
                    <LayoutGrid className="w-4 h-4" />
                    Quản lý bài viết
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </Link>
                <Link to="/blog/create-blog">
                  <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg text-sm">
                    <Plus className="w-4 h-4" />
                    Tạo bài viết mới
                  </button>
                </Link>
              </div>
            )}

            {/* Search Bar */}
            <div className="max-w-lg mb-4">
              <div className="flex shadow-lg rounded-xl overflow-hidden bg-white border border-gray-200">
                <input
                  type="text"
                  placeholder="Tìm kiếm bài viết..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-4 py-2.5 text-sm focus:outline-none"
                />
                <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 font-semibold transition-colors flex items-center text-sm">
                  <Search className="w-4 h-4 mr-2" />
                  Tìm kiếm
                </button>
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-1.5">
              <button
                key="all"
                onClick={() => setActiveCategory("all")}
                className={`px-3 py-1.5 rounded-full font-medium transition-all duration-200 text-xs ${
                  activeCategory === "all"
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                Tất cả
              </button>
              {BLOG_CATEGORIES.map((category) => (
                <button
                  key={category.label}
                  onClick={() => setActiveCategory(category.label)}
                  className={`px-3 py-1.5 rounded-full font-medium transition-all duration-200 text-xs ${
                    activeCategory === category.label
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  {category.value}
                </button>
              ))}
            </div>
          </div>

          {/* CỘT PHẢI: Banner Slider */}
          <div className="relative w-full h-[200px] sm:h-[260px] md:h-[320px] rounded-2xl overflow-hidden shadow-xl group order-1 lg:order-2">
            {blogBanners.map((banner, index) => (
              <div
                key={banner.id}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  currentSlide === index ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900/70 via-gray-900/40 to-transparent z-10" />
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700"
                />
                <div className="absolute inset-0 flex items-center z-20 px-6 sm:px-8 md:px-10">
                  <div className="max-w-xs">
                    <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white mb-1 md:mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      {banner.title}
                    </h2>
                    <p className="text-xs sm:text-sm md:text-base text-white/80 font-medium translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                      {banner.subtitle}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Dots điều hướng */}
            <div className="absolute bottom-3 left-0 right-0 z-30 flex justify-center gap-1.5">
              {blogBanners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    currentSlide === index ? "w-5 bg-white" : "w-1.5 bg-white/40 hover:bg-white/70"
                  }`}
                  aria-label={`Chuyển slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
          {postsToShow.map((post, index) => (
            <div key={index}>
              <Link to={`/blog/detail/${post.slug}`}>
                <article className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow border border-gray-100 hover:border-blue-200 h-full flex flex-col">
                  {/* Image */}
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={post.image?.url || "/placeholder.svg"}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-4 flex flex-col flex-1">
                    {/* Category */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="inline-block px-3 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 text-xs font-bold rounded-lg border border-blue-100">
                        {post.category}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-bold text-gray-900 line-clamp-2 mb-2 leading-tight hover:text-blue-600 transition-colors">
                      {post.title}
                    </h3>

                    {/* Content */}
                    <p className="text-gray-600 line-clamp-2 text-xs leading-relaxed mb-3">
                      {stripHtmlTags(post.content)}
                    </p>

                    {/* Author & Date */}
                    <div className="flex items-center justify-between mb-3 text-xs text-gray-500 h-6">
                      <div className="flex items-center">
                        <Avatar className="size-6 ring-2 ring-gray-200 shadow-md mr-1.5">
                          <AvatarImage
                            src={post.created_by.profile.profilePhoto.url || "/placeholder.svg"}
                            className="object-cover"
                            alt={post.created_by.fullname}
                          />
                          <AvatarFallback className="text-[10px] font-semibold bg-primary/10">
                            {post.created_by.fullname
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium truncate max-w-[80px]">
                          {post.created_by.fullname}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        <span className="text-[10px]">
                          {formatDistanceToNow(new Date(post?.createdAt || new Date()), {
                            addSuffix: true,
                            locale: vi,
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mt-auto h-12 content-start">
                      {post.tags.slice(0, 2).map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-2.5 py-1 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 text-[10px] font-semibold rounded-lg hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 transition-colors cursor-pointer border border-gray-200 hover:border-blue-200 h-fit"
                        >
                          #{tag}
                        </span>
                      ))}
                      {post.tags.length > 2 && (
                        <span className="px-2.5 py-1 text-gray-400 text-[10px] font-medium bg-gray-50 rounded-lg border border-gray-200 h-fit">
                          +{post.tags.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              </Link>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-base mb-3">
              Không tìm thấy bài viết nào
            </div>
            <p className="text-gray-400 text-sm">
              Thử tìm kiếm với từ khóa khác hoặc chọn danh mục khác
            </p>
          </div>
        )}

        {/* Load More Button */}
        {visibleCount < filteredPosts.length && (
          <div className="flex justify-center mt-8">
            <button
              className="bg-white border border-blue-500 text-blue-700 px-5 py-2 rounded-full font-semibold hover:bg-blue-50 transition text-sm"
              onClick={() => setVisibleCount((vc) => vc + 8)}
            >
              Hiển thị thêm
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPageBlog;