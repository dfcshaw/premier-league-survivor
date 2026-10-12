"use client";
import { useRouter } from "next/navigation";

export default function BackButton({
  label = "← Back",
  className = "text-sm text-pl-purple/60 hover:underline",
}: {
  label?: string;
  className?: string;
}) {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => router.back()}
      className={className}
    >
      {label}
    </button>
  );
}