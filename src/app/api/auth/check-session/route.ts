import { NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function GET() {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    const isAuthenticated = !!user;
    const isAdmin = user?.email === process.env.ADMIN_EMAIL;

    return NextResponse.json({
      isAuthenticated,
      user: user
        ? {
            id: user.id,
            email: user.email,
            given_name: user.given_name,
            family_name: user.family_name,
          }
        : null,
      isAdmin,
    });
  } catch (error) {
    console.error("Session check error:", error);
    return NextResponse.json({
      isAuthenticated: false,
      user: null,
      isAdmin: false,
    });
  }
}
