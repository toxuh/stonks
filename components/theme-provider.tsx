"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

export const ThemeProvider = ({ children, ...props }: Readonly<ThemeProviderProps>) => (
  <NextThemesProvider attribute="class" defaultTheme="system" enableSystem {...props}>
    {children}
  </NextThemesProvider>
);

