export type IbuTheme = "low" | "mid" | "high" | "extreme";

export function ibuToTheme(ibu: number): IbuTheme {
  if (ibu < 25) return "low";
  if (ibu < 50) return "mid";
  if (ibu < 75) return "high";
  return "extreme";
}
