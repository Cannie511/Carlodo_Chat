import { cookies } from "next/headers";

export const POST = async (req: Request) => {
    try {
        const {accessToken} = await req.json();
        console.log(accessToken);
        (await cookies()).set("accessToken", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 5
        });
        return Response.json({ success: true });
    } catch (error) {
        console.log("Lỗi set cookie: ", error);
        return Response.json({ success: false, message: "Lỗi khi set cookie" }, { status: 500 });
    }
}