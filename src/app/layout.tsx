import './globals.css'
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ThemeProvider } from "@/components/ThemeProvider"
import { AuthProvider } from "@/lib/auth"
import { OrganizationProvider } from "@/lib/organization"
import { ErrorBoundary } from "@/components/ErrorBoundary"
import { ReactQueryProvider } from './ReactQueryProvider'

export const metadata = {
  title: 'Supauth - Open Source Auth Kit',
  description: 'Open source authentication kit built with Next.js, React, Supabase, and shadcn/ui',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ErrorBoundary>
          <ReactQueryProvider>
            <AuthProvider>
              <OrganizationProvider>
                <ThemeProvider defaultTheme="system" storageKey="supauth-theme">
                  <TooltipProvider>
                    <Toaster />
                    <Sonner />
                    {children}
                  </TooltipProvider>
                </ThemeProvider>
              </OrganizationProvider>
            </AuthProvider>
          </ReactQueryProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
} 