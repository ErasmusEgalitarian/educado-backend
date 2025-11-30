export const difficultyToTranslation = (
  t: (key: string) => string,
  difficulty: string | number
): string => {
  switch (String(difficulty).toLowerCase()) {
    case "1":
      return t("difficulty.beginner");
    case "2":
      return t("difficulty.intermediate");
    case "3":
      return t("difficulty.advanced");
    default:
      return String(difficulty);
  }
};
