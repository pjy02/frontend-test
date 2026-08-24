import { getCookie, removeCookie, setCookie } from "@workspace/ui/lib/cookies";
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export const DENSITIES = ["compact", "comfortable", "spacious"] as const;

export type Density = (typeof DENSITIES)[number];

const DEFAULT_DENSITY: Density = "comfortable";
const DENSITY_COOKIE_NAME = "density";
const DENSITY_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function parseDensity(value: unknown): Density | undefined {
  return DENSITIES.find((density) => density === value);
}

type DensityContextValue = {
  defaultDensity: Density;
  density: Density;
  resetDensity: () => void;
  setDensity: (density: Density) => void;
};

const DensityContext = createContext<DensityContextValue | undefined>(
  undefined
);

type DensityProviderProps = {
  children: ReactNode;
  defaultDensity?: Density;
  storageKey?: string;
};

export function DensityProvider({
  children,
  defaultDensity = DEFAULT_DENSITY,
  storageKey = DENSITY_COOKIE_NAME,
}: DensityProviderProps) {
  const [density, setDensityState] = useState<Density>(
    () => parseDensity(getCookie(storageKey)) ?? defaultDensity
  );

  useEffect(() => {
    document.documentElement.dataset.density = density;
  }, [density]);

  const value = useMemo<DensityContextValue>(
    () => ({
      defaultDensity,
      density,
      resetDensity: () => {
        removeCookie(storageKey);
        setDensityState(defaultDensity);
      },
      setDensity: (nextDensity) => {
        setCookie(storageKey, nextDensity, DENSITY_COOKIE_MAX_AGE);
        setDensityState(nextDensity);
      },
    }),
    [defaultDensity, density, storageKey]
  );

  return <DensityContext value={value}>{children}</DensityContext>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useDensity() {
  const context = useContext(DensityContext);

  if (!context) {
    throw new Error("useDensity must be used within a DensityProvider");
  }

  return context;
}
