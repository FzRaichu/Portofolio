import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Nav } from "@/components/nav";
import { CommandPalette } from "@/components/command-palette";
import { EditToggle } from "@/components/edit-toggle";
import { LandingGate } from "@/components/landing-gate";
import { StarfieldMount } from "@/components/three/starfield-mount";
import { EditModeProvider } from "@/lib/edit-mode";
import { getSiteContent } from "@/lib/kv";
import { SectionNavProvider } from "@/lib/section-nav";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";
import { VisitorProvider } from "@/lib/visitor";
import { JourneyControls } from "@/components/journey-controls";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  return {
    title: `${content.name} — ${content.role}`,
    description: content.tagline,
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const cookieStore = await cookies();
  const isOwner = verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value);
  const content = await getSiteContent();

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col overflow-x-hidden">
        <a
          href="#main-content"
          className="sr-only fixed top-3 left-3 z-110 rounded-lg bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only"
        >
          Skip to content
        </a>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            <VisitorProvider>
              <EditModeProvider isOwner={isOwner} initialContent={content}>
                <SectionNavProvider>
                  <StarfieldMount />
                  <LandingGate />
                  <CommandPalette />
                  <Nav />
                  <main id="main-content" tabIndex={-1} className="flex-1">
                    {children}
                  </main>
                  <EditToggle />
                  <JourneyControls />
                </SectionNavProvider>
              </EditModeProvider>
            </VisitorProvider>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
