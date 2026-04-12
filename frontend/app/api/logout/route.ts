import { cookies } from "next/headers";

export async function POST(req: Request) {

  // 👉 set cookie tại Next.js
  (await cookies()).delete("accessToken");
  (await cookies()).delete("refreshToken");
  return Response.json({ success: true });
}