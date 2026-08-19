import "./globals.css";
import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import SignOutButton from "@/components/SignOutButton";

export const metadata: Metadata = {
  title: "PL Survivor",
  description: "A Premier League survivor pool you actually want to play",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="en">
      <body className="min-h-screen">
        <header className="border-b border-pl-purple/10 bg-pl-purple">
          <div className="mx-auto flex max-w-5xl items-center justify-between p-4">
            <Link href="/" className="text-lg font-bold text-pl-accent-text">
              PL Survivor
            </Link>
            <nav className="flex items-center gap-3 text-sm">
              {user ? (
                <>
                  <Link href="/dashboard" className="hover:underline">
                    Dashboard
                  </Link>
                  <SignOutButton />
                </>
              ) : (
                <>
                  <Link href="/login" className="hover:underline">
                    Log in
                  </Link>
                  <Link href="/signup" className="btn !py-1.5">
                    Sign up
                  </Link>
                </>
              )}
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-5xl p-4 sm:p-8">{children}</main>
      </body>
    </html>
  );
}
