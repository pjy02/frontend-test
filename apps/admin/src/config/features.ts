export function parseFeatureFlag(
  value: string | undefined,
  defaultValue = false
): boolean {
  if (value === undefined || value === "") return defaultValue;
  return value.toLowerCase() === "true" || value === "1";
}

export const ADMIN_UI_V2 = parseFeatureFlag(
  import.meta.env.VITE_ADMIN_UI_V2,
  false
);
