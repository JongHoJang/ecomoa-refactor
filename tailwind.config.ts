import type { Config } from "tailwindcss";
import { PluginAPI } from "tailwindcss/types/config";
const plugin = require("tailwindcss/plugin");

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)"
      }
    }
  },
  plugins: [
    plugin(function ({ addUtilities }: PluginAPI) {
      addUtilities({
        ".flex-col-center": {
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center"
        },
        ".flex-row-center": {
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center"
        }
      });
    })
  ]
};
export default config;
