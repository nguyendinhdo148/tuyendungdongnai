import { Blog } from "../models/blog.model.js";
import { Company } from "../models/company.model.js";
import { Job } from "../models/job.model.js";

const SITE_URL = "https://www.tuyendungdongnai.com";

const staticPaths = [
  "/",
  "/jobs",
  "/blog",
  "/resume",
  "/resume/learn-more",
  "/tools/mbti",
  "/tools/mbti/tinh-cach/infp",
  "/tools/mbti/tinh-cach/infj",
  "/tools/mbti/tinh-cach/intj",
  "/tools/mbti/tinh-cach/intp",
  "/tools/mbti/tinh-cach/istj",
  "/tools/mbti/tinh-cach/isfj",
  "/tools/mbti/tinh-cach/istp",
  "/tools/mbti/tinh-cach/isfp",
  "/tools/mbti/tinh-cach/estp",
  "/tools/mbti/tinh-cach/esfp",
  "/tools/mbti/tinh-cach/enfp",
  "/tools/mbti/tinh-cach/entp",
  "/tools/mbti/tinh-cach/estj",
  "/tools/mbti/tinh-cach/esfj",
  "/tools/mbti/tinh-cach/enfj",
  "/tools/mbti/tinh-cach/entj",
  "/tools/mi",
  "/tools/gross-net",
  "/tools/personal-tax",
  "/tools/compound-interest",
  "/tools/social-insurance",
  "/tools/unemployment-insurance",
  "/tools/saving-plan",
];

const escapeXml = (value) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const createUrlEntry = (path, updatedAt) => {
  const lastmod =
    updatedAt instanceof Date && !Number.isNaN(updatedAt.getTime())
      ? `<lastmod>${updatedAt.toISOString()}</lastmod>`
      : "";

  return `<url><loc>${escapeXml(`${SITE_URL}${path}`)}</loc>${lastmod}</url>`;
};

export const getSitemap = async (req, res, next) => {
  try {
    const [companies, jobs, blogs] = await Promise.all([
      Company.find({ approval: "approved" })
        .select("slug updatedAt")
        .lean(),
      Job.find({ status: "active", approval: "approved" })
        .select("slug updatedAt company")
        .populate({ path: "company", select: "approval" })
        .lean(),
      Blog.find({ approval: "approved" })
        .select("slug updatedAt")
        .lean(),
    ]);

    const entries = new Map(
      staticPaths.map((path) => [path, createUrlEntry(path)])
    );

    companies.forEach((company) => {
      if (company.slug) {
        const path = `/company/detail/${encodeURIComponent(company.slug)}`;
        entries.set(path, createUrlEntry(path, company.updatedAt));
      }
    });

    jobs.forEach((job) => {
      if (job.slug && job.company?.approval === "approved") {
        const path = `/job/detail/${encodeURIComponent(job.slug)}`;
        entries.set(path, createUrlEntry(path, job.updatedAt));
      }
    });

    blogs.forEach((blog) => {
      if (blog.slug) {
        const path = `/blog/detail/${encodeURIComponent(blog.slug)}`;
        entries.set(path, createUrlEntry(path, blog.updatedAt));
      }
    });

    if (entries.size > 50000) {
      return res.status(500).json({
        success: false,
        message:
          "Sitemap exceeds the 50,000 URL limit; split it into multiple sitemap files.",
      });
    }

    const xml = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      ...entries.values(),
      "</urlset>",
    ].join("");

    res
      .status(200)
      .type("application/xml")
      .set("Cache-Control", "public, max-age=3600, stale-while-revalidate=86400")
      .send(xml);
  } catch (error) {
    next(error);
  }
};
