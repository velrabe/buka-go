export const DESIGN_STORAGE_KEY = "bukago.design.v1";
export const DESIGN_MESSAGE = "bukago:design-settings";
export const DESIGN_FRAME_NAME = "bukago-design-canvas";

export const fonts = {
  nunito: { label: "Nunito", stack: '"Nunito", sans-serif' },
  inter: { label: "Inter", stack: '"Inter", sans-serif' },
  rubik: { label: "Rubik", stack: '"Rubik", sans-serif' },
  onest: { label: "Onest", stack: '"Onest", sans-serif' },
  manrope: { label: "Manrope", stack: '"Manrope", sans-serif' },
  rounded: { label: "M PLUS Rounded 1c", stack: '"M PLUS Rounded 1c", sans-serif' },
  system: { label: "Системный Rounded", stack: 'ui-rounded, "Nunito", sans-serif' },
} as const;

export const widths = ["360", "390", "430", "full"] as const;
export const densities = {
  compact: { label: "Компактно", spacing: "clamp(32px, 5vw, 64px)" },
  balanced: { label: "Базовые", spacing: "clamp(48px, 7vw, 88px)" },
  spacious: { label: "Больше воздуха", spacing: "clamp(64px, 9vw, 112px)" },
} as const;

export type DesignSettings = {
  heading: keyof typeof fonts;
  body: keyof typeof fonts;
  width: (typeof widths)[number];
  radius: "8" | "16" | "24";
  density: keyof typeof densities;
};

export const defaults: DesignSettings = {
  heading: "nunito", body: "inter", width: "390", radius: "8", density: "balanced",
};

type StyleSettings = Omit<DesignSettings, "width">;
export const presets: Record<string, { label: string; settings: StyleSettings }> = {
  original: { label: "Исходная типографика", settings: {
    heading: "nunito", body: "inter", radius: "8", density: "balanced",
  } },
  app: { label: "Ближе к приложению", settings: {
    heading: "rubik", body: "onest", radius: "16", density: "balanced",
  } },
  soft: { label: "Округлый", settings: {
    heading: "rounded", body: "onest", radius: "24", density: "spacious",
  } },
  neutral: { label: "Спокойный", settings: {
    heading: "onest", body: "onest", radius: "8", density: "compact",
  } },
};

export function normalizeSettings(value: unknown): DesignSettings {
  const input = value && typeof value === "object" ? value as Record<string, unknown> : {};
  const pick = <T extends string>(key: string, allowed: readonly T[], fallback: T): T =>
    allowed.includes(input[key] as T) ? input[key] as T : fallback;
  return {
    heading: pick("heading", Object.keys(fonts) as (keyof typeof fonts)[], defaults.heading),
    body: pick("body", Object.keys(fonts) as (keyof typeof fonts)[], defaults.body),
    width: pick("width", widths, defaults.width),
    radius: pick("radius", ["8", "16", "24"], defaults.radius),
    density: pick("density", Object.keys(densities) as (keyof typeof densities)[], defaults.density),
  };
}

export function isLocalPreview(hostname: string) {
  return ["localhost", "127.0.0.1", "[::1]", "::1"].includes(hostname);
}

export function settingsFromStorage(): DesignSettings {
  try {
    return normalizeSettings(JSON.parse(localStorage.getItem(DESIGN_STORAGE_KEY) || "null"));
  } catch {
    return { ...defaults };
  }
}

export function applyDesignSettings(value: unknown) {
  const settings = normalizeSettings(value);
  const style = document.documentElement.style;
  style.setProperty("--font-heading", fonts[settings.heading].stack);
  style.setProperty("--font-body", fonts[settings.body].stack);
  style.setProperty("--radius", `${settings.radius}px`);
  style.setProperty("--section-space", densities[settings.density].spacing);
}
