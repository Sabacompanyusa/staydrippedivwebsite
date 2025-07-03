#!/usr/bin/env node

// Build script for Stay Dripped Mobile IV

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("🚀 Building Stay Dripped Mobile IV...\n");

const startTime = Date.now();

try {
  // Clean dist directory
  console.log("🧹 Cleaning dist directory...");
  if (fs.existsSync("dist")) {
    fs.rmSync("dist", { recursive: true, force: true });
  }

  // Run linting
  console.log("🔍 Running linters...");
  execSync("npm run lint", { stdio: "inherit" });

  // Build assets with webpack
  console.log("📦 Building assets...");
  execSync("npx webpack --env production", { stdio: "inherit" });

  // Copy static files
  console.log("📋 Copying static files...");
  copyStaticFiles();

  // Generate sitemap
  console.log("🗺️  Generating sitemap...");
  generateSitemap();

  // Generate robots.txt
  console.log("🤖 Generating robots.txt...");
  generateRobotsTxt();

  // Build report
  const buildTime = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`\n✅ Build completed in ${buildTime}s!`);

  // Display bundle sizes
  displayBundleSizes();
} catch (error) {
  console.error("❌ Build failed:", error.message);
  process.exit(1);
}

function copyStaticFiles() {
  const staticFiles = [
    "manifest.json",
    "sw.js",
    "components/",
    "pages/",
    "favicon.ico",
  ];

  staticFiles.forEach((file) => {
    if (fs.existsSync(file)) {
      const dest = path.join("dist", file);
      fs.cpSync(file, dest, { recursive: true });
    }
  });
}

function generateSitemap() {
  const pages = [
    { url: "/", priority: "1.0", changefreq: "weekly" },
    { url: "/services.html", priority: "0.9", changefreq: "weekly" },
    { url: "/iv-therapy.html", priority: "0.8", changefreq: "monthly" },
    { url: "/nad-therapy.html", priority: "0.8", changefreq: "monthly" },
    { url: "components/html/how-it-works.html", priority: "0.7", changefreq: "monthly" },
    { url: "components/html/memberships.html", priority: "0.7", changefreq: "monthly" },
    { url: "components/html/testimonials.html", priority: "0.6", changefreq: "weekly" },
    { url: "components/html/faq.html", priority: "0.6", changefreq: "monthly" },
    { url: "components/html/booking.html", priority: "0.9", changefreq: "daily" },
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) => `  <url>
    <loc>https://staydrippedmobileiv.com${page.url}</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>`;

  fs.writeFileSync("dist/sitemap.xml", sitemap);
}

function generateRobotsTxt() {
  const robots = `User-agent: *
Allow: /

Sitemap: https://staydrippedmobileiv.com/sitemap.xml

# Disallow admin and sensitive areas
Disallow: /admin/
Disallow: /api/
Disallow: /*.json$
Disallow: /sw.js
`;

  fs.writeFileSync("dist/robots.txt", robots);
}

function displayBundleSizes() {
  console.log("\n📊 Bundle Sizes:");

  const distPath = "dist";
  const files = ["css", "js"]
    .map((type) => {
      const dir = path.join(distPath, type);
      if (fs.existsSync(dir)) {
        return fs
          .readdirSync(dir)
          .filter((file) => file.endsWith(`.${type}`))
          .map((file) => {
            const filePath = path.join(dir, file);
            const stats = fs.statSync(filePath);
            const size = (stats.size / 1024).toFixed(2);
            return `  ${file}: ${size} KB`;
          });
      }
      return [];
    })
    .flat();

  files.forEach((file) => console.log(file));
}
