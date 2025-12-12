export const EDUCATION_TYPES = [
  "High School",
  "Bachelor's Degree",
  "Master's Degree",
  "PhD",
  "Associate Degree",
  "Vocational Training",
] as const;

export const EDUCATION_OPTIONS = EDUCATION_TYPES.map((type) => ({
  value: type.toLowerCase().replace(/\s+/g, "-"),
  label: type,
}));