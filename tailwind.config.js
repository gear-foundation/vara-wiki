const defaultTheme = require("tailwindcss/defaultTheme");
const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx,md,mdx}", "./docs/**/*.{md,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: "rgb(var(--brand) / <alpha-value>)",
        "brand-400": "rgb(var(--brand-400) / <alpha-value>)",
        "brand-500": "rgb(var(--brand-500) / <alpha-value>)",
        "brand-600": "rgb(var(--brand-600) / <alpha-value>)",
      },
      fontFamily: {
        anuphan: ["var(--font-anuphan)", ...defaultTheme.fontFamily.sans],
      },

      fontSize: {
        // sm: ['14px', '20px'],
        base: ["16px", "26px"],
        // lg: ['20px', '28px'],
        // xl: ['24px', '32px'],
      },
      spacing: {
        2.5: "0.625rem",
        4.5: "1.125rem",
        5.5: "1.375rem",
        6.5: "1.625rem",
        7.5: "1.875rem",
        8: "2rem",
        8.5: "2.125rem",
        9: "2.25rem",
        9.5: "2.375rem",
        11.5: "2.875rem",
        12: "3rem",
        12.5: "3.125rem",
        13: "3.25rem",
        14.5: "3.625rem",
        15: "3.75rem",
        17: "4.25rem",
        17.5: "4.375rem",
        18: "4.5rem",
        19: "4.75rem",
        22: "5.5rem",
        22.5: "5.625rem",
        25: "6.25rem",
        26: "6.5rem",
        27: "6.75rem",
        27.5: "6.875rem",
        30: "7.5rem",
        31: "7.75rem",
        32: "8rem",
        33: "8.25rem",
        34: "8.5rem",
        35: "8.75rem",
        36: "9rem",
        37: "9.25rem",
        37.5: "9.375rem",
        38: "9.5rem",
        42: "10.5rem",
        43: "10.75rem",
        44: "11rem",
        45: "11.25rem",
        46: "11.5rem",
        47: "11.75rem",
        48: "12rem",
        49: "12.25rem",
        50: "12.5rem",
        55: "13.75rem",
        56: "14rem",
        57: "14.25rem",
        58: "14.5rem",
        59: "14.75rem",
        60: "15rem",
        62: "15.5rem",
        62.5: "15.625rem",
        63: "15.75rem",
        64: "16rem",
      },
      textDecorationThickness: {
        3: "3px",
        6: "6px",
      },
      textUnderlineOffset: {
        5: "5px",
        6: "6px",
      },
      zIndex: {
        1: "1",
        2: "2",
        60: "60",
      },
    },
  },
  plugins: [
    plugin(function ({ addVariant }) {
      addVariant("hocus", ["&:hover", "&:focus-visible"]);
      addVariant("group-hocus", ":merge(.group):hocus &");
      addVariant("peer-hocus", ":merge(.peer):hocus ~ &");
    }),
  ],
  darkMode: ["class", '[data-theme="dark"]'],
  corePlugins: {
    preflight: false,
  },
  blocklist: ["container"],
};
