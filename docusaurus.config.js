// @ts-check
const { themes } = require("prism-react-renderer");

const baseUrl = process.env.DOCS_BASE_URL || "/playstash-docs/";
if (!baseUrl.startsWith("/") || !baseUrl.endsWith("/")) {
  throw new Error("DOCS_BASE_URL must start and end with a slash.");
}

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "PlayStash",
  tagline: "Self-hosted game library documentation",
  favicon: "img/playstash-logo.png",
  url: process.env.DOCS_URL || "https://playstash.github.io",
  baseUrl,
  organizationName: "PlayStash",
  projectName: "playstash-docs",
  onBrokenLinks: "throw",
  onBrokenAnchors: "throw",
  markdown: { hooks: { onBrokenMarkdownLinks: "throw" } },
  i18n: { defaultLocale: "en", locales: ["en"] },
  plugins: [[require.resolve("@cmfcmf/docusaurus-search-local"), { indexDocs: true, indexBlog: false, indexPages: false }]],
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl: "https://github.com/PlayStash/playstash-docs/edit/dev/",
        },
        blog: false,
        theme: { customCss: require.resolve("./src/css/custom.css") },
      },
    ],
  ],
  themeConfig: {
    image: "img/playstash-logo.png",
    metadata: [
      { name: "keywords", content: "PlayStash, self-hosted, game library, documentation" },
    ],
    navbar: {
      title: "PlayStash",
      logo: { alt: "PlayStash", src: "img/playstash-logo.png" },
      items: [
        { type: "docSidebar", sidebarId: "docs", position: "left", label: "Documentation" },
        { href: "https://github.com/PlayStash/playstash-docs", label: "GitHub", position: "right" },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Documentation",
          items: [
            { label: "Start here", to: "/docs/intro" },
            { label: "Set up a server", to: "/docs/server-docs/setup/" },
            { label: "Download Docker Compose", href: `pathname://${baseUrl}downloads/docker-compose.yml` },
            { label: "Troubleshooting", to: "/docs/troubleshooting" },
          ],
        },
        {
          title: "Project",
          items: [
            { label: "Repositories", href: "https://github.com/orgs/PlayStash/repositories" },
            { label: "License and attribution", to: "/docs/license-contribute" },
            { label: "License text", href: `pathname://${baseUrl}LICENSE` },
            { label: "Attribution notice", href: `pathname://${baseUrl}NOTICE.txt` },
          ],
        },
      ],
      copyright: `PlayStash documentation · ${new Date().getFullYear()}. Original work and licenses are acknowledged in NOTICE and LICENSE.`,
    },
    prism: { theme: themes.github, darkTheme: themes.dracula, additionalLanguages: ["bash", "json", "yaml"] },
  },
};

module.exports = config;
