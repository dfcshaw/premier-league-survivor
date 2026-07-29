import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.redirect(new URL("/login", _req.url), { status: 303 });
  }

  const { error } = await supabase.rpc("score_and_advance_gameweek", {
    _league_id: params.id,
  });

  if (error) {
    return NextResponse.redirect(
      new URL(`/leagues/${params.id}?error=${encodeURIComponent(error.message)}`, _req.url),
      { status: 303 }
    );
  }

  return NextResponse.redirect(
    new URL(`/leagues/${params.id}?ok=1`, _req.url),
    { status: 303 }
  );
}