"use client"

import { Inter } from "next/font/google"
import { ThemeProvider  as NextThemeProvider, useTheme} from "next-themes"
import { ThemeProvider } from "@/src/components/theme-provider"
import { LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { SnackbarProvider } from "notistack"
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter"

import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Todo</title>
        <link rel="icon" href="/47-to-do-list.svg" type="image/svg+xml" />
      </head>
      <body className={inter.className}>
      <NextThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AppRouterCacheProvider>
          <ThemeProvider initialMode={resolvedTheme === "dark" ? "dark" : "light"} setTheme={setTheme}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
                {children}
              </SnackbarProvider>
            </LocalizationProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </NextThemeProvider>
      </body>
    </html>
  )
}

