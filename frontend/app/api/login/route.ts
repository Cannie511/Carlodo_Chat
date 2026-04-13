import { authService } from "@/app/services/authService";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { success } from "zod";

export async function POST(req: Request) {
  const {username, password} = await req.json();
  try {
    const res = await authService.signIn({username, password});

    const {accessToken, refreshToken} = res;

    // 👉 set cookie tại Next.js
    (await cookies()).set("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 5
    });
    (await cookies()).set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 14
    });
    return Response.json({ accessToken, refreshToken, success: true });
  } catch (error:any) {
    return NextResponse.json(error?.message, {status: error.status})
  }
}