import { DM_Sans, Nunito_Sans, Recursive } from "next/font/google";
import localFont from "next/font/local";

/**
 * Fonts Used in the project
 * - Headings/Navigation/CTAs: Nohemi (600–700)
 * - Body/UI text: Yeager One (400)
 */

// Headings/Navigation/CTAs: Nohemi (600–700)
export const nohemi = localFont({
  src: [
    { path: "./Nohemi-Thin.woff2", weight: "100", style: "normal" },
    { path: "./Nohemi-ExtraLight.woff2", weight: "200", style: "normal" },
    { path: "./Nohemi-Light.woff2", weight: "300", style: "normal" },
    { path: "./Nohemi-Regular.woff2", weight: "400", style: "normal" },
    { path: "./Nohemi-Medium.woff2", weight: "500", style: "normal" },
    { path: "./Nohemi-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "./Nohemi-Bold.woff2", weight: "700", style: "normal" },
    { path: "./Nohemi-ExtraBold.woff2", weight: "800", style: "normal" },
    { path: "./Nohemi-Black.woff2", weight: "900", style: "normal" },
  ],
  display: "swap",
  variable: "--nohemi-font",
  adjustFontFallback: false,
});

// Body/UI text: Yeager One (400)
export const yeagerOne = localFont({
  src: [
    {
      path: "./Yeager-Light.otf",
      weight: "300",
      style: "light",
    },
    {
      path: "./Yeager-Regular.otf",
      weight: "400",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--yeager-one-font",
  adjustFontFallback: false,
});

/**
 * Fonts Below are to be used in Creating Templates Variations
 */
export const nunSans = Nunito_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--nunSans-font",
  adjustFontFallback: false,
});

export const recursiveSans = Recursive({
  subsets: ["latin"],
  display: "swap",
  variable: "--recursiv-font",
  adjustFontFallback: false,
});

export const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--dm-sans-font",
  adjustFontFallback: false,
});

export const newKansas = localFont({
  src: [
    {
      path: "./New Kansas Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "./New Kansas Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./New Kansas Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./New Kansas Medium.otf",
      weight: "500",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--new-Kansas-font",
  adjustFontFallback: false,
});

export const basierSquareMonoFont = localFont({
  src: "./basiersquaremono-regular-webfont.woff2",
  display: "swap",
  variable: "--basier-square-mono-font",
  adjustFontFallback: false,
});

export const rebeqa = localFont({
  src: [
    { path: "./Rebeqa-Thin.woff2", weight: "100", style: "normal" },
    { path: "./Rebeqa-ThinItalic.woff2", weight: "100", style: "italic" },
    { path: "./Rebeqa-ExtraLight.woff2", weight: "200", style: "normal" },
    { path: "./Rebeqa-ExtraLightItalic.woff2", weight: "200", style: "italic" },
    { path: "./Rebeqa-Light.woff2", weight: "300", style: "normal" },
    { path: "./Rebeqa-LightItalic.woff2", weight: "300", style: "italic" },
    { path: "./Rebeqa-Regular.woff2", weight: "400", style: "normal" },
    { path: "./Rebeqa-Italic.woff2", weight: "400", style: "italic" },
    { path: "./Rebeqa-Medium.woff2", weight: "500", style: "normal" },
    { path: "./Rebeqa-MediumItalic.woff2", weight: "500", style: "italic" },
    { path: "./Rebeqa-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "./Rebeqa-SemiBoldItalic.woff2", weight: "600", style: "italic" },
    { path: "./Rebeqa-Bold.woff2", weight: "700", style: "normal" },
    { path: "./Rebeqa-BoldItalic.woff2", weight: "700", style: "italic" },
    { path: "./Rebeqa-ExtraBold.woff2", weight: "800", style: "normal" },
    { path: "./Rebeqa-ExtraBoldItalic.woff2", weight: "800", style: "italic" },
    { path: "./Rebeqa-Black.woff2", weight: "900", style: "normal" },
    { path: "./Rebeqa-BlackItalic.woff2", weight: "900", style: "italic" },
  ],
  display: "swap",
  variable: "--rebeqa-font",
  adjustFontFallback: false,
});

// Heading Font: used in the Gold Shine template
export const harmonSemiBoldCondensedFont = localFont({
  src: "./Harmond-SemiBoldCondensed.otf",
  display: "swap",
  variable: "--harmon-semi-bold-condensed-font",
  adjustFontFallback: false,
});

// Good Body Font
export const neueHaasDisplay = localFont({
  src: [
    { path: "./NeueHaasDisplayXXThin.ttf", weight: "100", style: "normal" },
    {
      path: "./NeueHaasDisplayXXThinItalic.ttf",
      weight: "100",
      style: "italic",
    },
    { path: "./NeueHaasDisplayXThin.ttf", weight: "200", style: "normal" },
    {
      path: "./NeueHaasDisplayXThinItalic.ttf",
      weight: "200",
      style: "italic",
    },
    { path: "./NeueHaasDisplayThin.ttf", weight: "300", style: "normal" },
    { path: "./NeueHaasDisplayThinItalic.ttf", weight: "300", style: "italic" },
    { path: "./NeueHaasDisplayLight.ttf", weight: "400", style: "normal" },
    {
      path: "./NeueHaasDisplayLightItalic.ttf",
      weight: "400",
      style: "italic",
    },
    { path: "./NeueHaasDisplayRoman.ttf", weight: "500", style: "normal" },
    {
      path: "./NeueHaasDisplayRomanItalic.ttf",
      weight: "500",
      style: "italic",
    },
    {
      path: "./NeueHaasDisplayMediumItalic.ttf",
      weight: "600",
      style: "italic",
    },
    { path: "./NeueHaasDisplayMediu.ttf", weight: "600", style: "normal" }, // Typo in filename, should be Medium
    { path: "./NeueHaasDisplayBold.ttf", weight: "700", style: "normal" },
    { path: "./NeueHaasDisplayBoldItalic.ttf", weight: "700", style: "italic" },
    { path: "./NeueHaasDisplayBlack.ttf", weight: "900", style: "normal" },
    {
      path: "./NeueHaasDisplayBlackItalic.ttf",
      weight: "900",
      style: "italic",
    },
  ],
  display: "swap",
  variable: "--neue-haas-display-font",
  adjustFontFallback: false,
});

// Headings: used in the Gold Shine template for the Links
export const maghfirea = localFont({
  src: "./Maghfirea.otf",
  display: "swap",
  variable: "--maghfirea-font",
  adjustFontFallback: false,
});

// Very Italic and Cursive
export const cremeEspana = localFont({
  src: "./Creme Espana.woff2",
  display: "swap",
  variable: "--creme-espana-font",
  adjustFontFallback: false,
});

// Body Font: used in the Gold Shine template
export const absans = localFont({
  src: "./Absans-Regular.woff2",
  display: "swap",
  variable: "--absans-font",
  adjustFontFallback: false,
});

// Could be the Primary Font
export const volaroidSan = localFont({
  src: "./Volaroid-san.otf",
  display: "swap",
  variable: "--volaroid-san-font",
  adjustFontFallback: false,
});

//  Could be used for Normal Text in landing page
export const dragon = localFont({
  src: [
    {
      path: "./Dragon-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./Dragon-RegularAngled.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "./Dragon-RegularInktrap.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./Dragon-RegularInktrapAngled.otf",
      weight: "400",
      style: "italic",
    },
  ],
  display: "swap",
  variable: "--dragon-font",
  adjustFontFallback: false,
});
