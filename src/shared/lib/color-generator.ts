/**
 * Generates a consistent hue (0-360) based on the input string.
 */
export const generateMakeHue = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash % 360);
};

/**
 * Generates a consistent neon color based on the input string (e.g. vehicle make).
 * Uses a hash function to determine the Hue, while keeping Saturation and Lightness
 * constant to ensure a "Neon" look.
 *
 * @param str - The input string (e.g., "Tesla", "BMW")
 * @returns A CSS HSL color string: "hsl(hue, 100%, 50%)"
 */
export const generateMakeColor = (str: string): string => {
  const hue = generateMakeHue(str);
  // Saturation 100%, Lightness 50% for maximum neon brightness
  return `hsl(${hue}, 100%, 50%)`;
};
