import localFont from "next/font/local";

export const nasaFont = localFont({
  src: [
    {
      path: "../../public/font/nasalization-rg.woff2",
      weight: "400",
      style: "normal",
    },
    // {
    //   path: "../../public/font/NASALIZA.woff2",
    //   weight: "700",
    //   style: "normal",
    // },
  ],
  display: "swap",
});
