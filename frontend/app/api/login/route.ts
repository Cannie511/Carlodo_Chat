import { authService } from "@/app/services/authService";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const {username, password} = await req.json();
  const res = await authService.signIn({username, password})
  console.log(res)
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
  return Response.json({ success: true });
}