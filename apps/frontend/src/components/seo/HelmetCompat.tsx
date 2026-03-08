import type { ComponentType, PropsWithChildren } from "react";
import {
  Helmet as HelmetBase,
  HelmetProvider as HelmetProviderBase,
  type HelmetProps,
} from "react-helmet-async";

type HelmetProviderProps = PropsWithChildren<{
  context?: object;
}>;

export const Helmet = HelmetBase as unknown as ComponentType<PropsWithChildren<HelmetProps>>;
export const HelmetProvider = HelmetProviderBase as unknown as ComponentType<HelmetProviderProps>;

export type { HelmetProps };
