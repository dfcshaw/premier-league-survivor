"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import SignOutButton from "./SignOutButton";

export default function UserMenu({ username }: { username: string | null }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const label = username || "Account";

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="text-white hover:underline flex items-center gap-1"
      >
        {label}
        <span className="text-xs">▾</span>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 rounded-md border border-pl-purple/10 bg-white shadow-lg z-10 py-1">
          {username && (
            <Link
              href={`/users/${encodeURIComponent(username)}`}
              className="block px-4 py-2 text-sm text-pl-purple hover:bg-pl-purple/5"
              onClick={() => setOpen(false)}
            >
              View profile
            </Link>
          )}
          <Link
            href="/profile/edit"
            className="block px-4 py-2 text-sm text-pl-purple hover:bg-pl-purple/5"
            onClick={() => setOpen(false)}
          >
            Edit profile
          </Link>
          <div className="border-t border-pl-purple/10 mt-1 pt-1">
            <div className="px-4 py-2 text-sm">
              <SignOutButton />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}