/**
 * Generates a random RGB values in hex
 * @returns
 */
const useGenerateRandomColor = () => {
  const getRgb = () => Math.floor(Math.random() * 256);

  const rgbToHex = (r:number, g:number, b:number) =>
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("");

  return rgbToHex(
    getRgb(),
    getRgb(),
    getRgb(),
  );
};

export { useGenerateRandomColor };
