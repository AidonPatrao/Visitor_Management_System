// src/lib/fonts.js
const { createFontStack } = require("@capsizecss/core");

// Import font metrics from Capsize
const firaCode = require("@capsizecss/metrics/firaCode");
const inter = require("@capsizecss/metrics/inter");
const plusJakartaSans = require("@capsizecss/metrics/plusJakartaSans");
const spaceGrotesk = require("@capsizecss/metrics/spaceGrotesk");
const dmSans = require("@capsizecss/metrics/dmSans");

module.exports = {
  // Utility default
  mono: createFontStack([firaCode]).fontFamily.split(", "),
  sans: createFontStack([inter]).fontFamily.split(", "),

  // Specific autocomplete classes for VS Code
  fira: createFontStack([firaCode]).fontFamily.split(", "),
  inter: createFontStack([inter]).fontFamily.split(", "),
  jakarta: createFontStack([plusJakartaSans]).fontFamily.split(", "),
  spacegrotesk: createFontStack([spaceGrotesk]).fontFamily.split(", "),
  dmsans: createFontStack([dmSans]).fontFamily.split(", "),
};