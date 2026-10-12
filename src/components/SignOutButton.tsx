"use client";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function SignOutButton() {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push("/");
        router.refresh();
      }}
      className="w-full text-left text-pl-purple hover:text-pl-accent-text"
    >
      Sign out
    </button>
  );
}
