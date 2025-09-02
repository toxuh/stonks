"use client";

import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes";

export const ThemeProvider = ({ children, ...props }: Readonly<ThemeProviderProps>) => (
  <NextThemesProvider attribute="class" defaultTheme="system" enableSystem {...props}>
    {children}
  </NextThemesProvider>
);

