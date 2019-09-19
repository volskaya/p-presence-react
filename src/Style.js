import { css } from "react-emotion";

export const font = "Whitney";

// Media query breakpoints
export const xspx = "0px";
export const smpx = "576px";
export const mdpx = "768px";
export const lgpx = "992px";
export const xlpx = "1200px";

export const bp = [
  `@media (min-width: ${xspx})`,
  `@media (min-width: ${smpx})`,
  `@media (min-width: ${mdpx})`,
  `@media (min-width: ${lgpx})`,
  `@media (min-width: ${xlpx})`
];

export const xs = bp[0];
export const sm = bp[1];
export const md = bp[2];
export const lg = bp[3];
export const xl = bp[4];

// Colors
export const foreground = "#E1E1E1";
export const background = "#121212";
export const gold = "#A08C5B";
export const goldBright = "#E9DBBD";
export const red = "#bc7a82";
export const redBright = "#ca606e";
export const faded = "#b1b1b1";

export const presenceShadow = "rgba(0,0,0,0.2)";
export const presenceBackground = "#212121";

export const presenceLightFg1 = "#5f5f5f";
export const presenceLightFg2 = "#bcbcbc";

export const presenceDarkBg = "#232323";
export const presenceDarkFg1 = "#363636";
export const presenceDarkFg2 = "#7e7e7e";
export const presenceDarkFg3 = "#bcbcbc";

// Font styles
export const t19 = css({
  fontWeight: "500",
  fontSize: "1.18em"
});

export const t22 = css({
  fontWeight: "500",
  fontSize: "1.4em"
});

export const t32 = css({
  fontWeight: "300",
  fontSize: "2em"
});

// Animation speeds
export const animShort = "0.15s";
export const animMedium = "0.25s";
export const animLong = "0.5s";

export const errorTime = 3000;

export const shadow = "0 6px 16px rgba(0,0,0,0.2)";
