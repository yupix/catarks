/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  ignoredRouteFiles: ["**/.*"],
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // serverBuildPath: "build/index.js",
  // publicPath: "/build/",
  serverDependenciesToBundle: [/^swiper.*/, /^ssr-window.*/],
  tailwind: true,
  future: {
    // unstable_tailwind: true, TODO: 記事で書く
    v2_meta: true,
    v2_errorBoundary: true,
    v2_dev: true
  },
};
