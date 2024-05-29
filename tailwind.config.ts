import { Config } from "tailwindcss";
import { blackA, mauve, violet } from "@radix-ui/colors";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./App.jsx", // Adding .jsx content path
  ],
  theme: {
    extend: {
      colors: {
        ...blackA,
        ...mauve,
        ...violet,
        primary: "#850F8D",
        secondry: "#C738BD",
        terniry: "#E49BFF",
      },
      keyframes: {
        slideDownAndFade: {
          "0%": { opacity: "0", transform: "translateY(-2px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideLeftAndFade: {
          "0%": { opacity: "0", transform: "translateX(2px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideUpAndFade: {
          "0%": { opacity: "0", transform: "translateY(2px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideRightAndFade: {
          "0%": { opacity: "0", transform: "translateX(-2px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
      animation: {
        slideDownAndFade:
          "slideDownAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        slideLeftAndFade:
          "slideLeftAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        slideUpAndFade: "slideUpAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        slideRightAndFade:
          "slideRightAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
