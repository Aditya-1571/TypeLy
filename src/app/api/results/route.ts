import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getLocalResults, saveLocalResult } from "@/lib/userStore";

function isDbConfigured(): boolean {
  const url = process.env.DATABASE_URL;
  if (!url) return false;
  if (url.includes('ep-sample') || url.includes('user:password') || url.includes('placeholder')) {
    return false;
  }
  return true;
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { wpm, accuracy, duration, textMode, errors, kps, wpmData } = body;
    const userId = (session.user as any).id;
    const userEmail = session.user.email?.toLowerCase() || null;

    if (isDbConfigured()) {
      try {
        const result = await prisma.testResult.create({
          data: {
            userId,
            wpm: Number(wpm),
            accuracy: Number(accuracy),
            duration: Number(duration),
            textMode: String(textMode),
            errors: Number(errors),
            kps: Number(kps),
            wpmData: wpmData || [],
          },
        });
        return NextResponse.json(result, { status: 201 });
      } catch (dbErr) {
        console.warn("DB save failed, falling back to local result store");
      }
    }

    // Local result store fallback
    const local = saveLocalResult({
      userId,
      userEmail,
      wpm: Number(wpm),
      accuracy: Number(accuracy),
      duration: Number(duration),
      textMode: String(textMode),
      errors: Number(errors),
      kps: Number(kps),
      wpmData: wpmData || [],
    });

    return NextResponse.json(local, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const userEmail = session.user.email?.toLowerCase() || null;

    if (isDbConfigured()) {
      try {
        const results = await prisma.testResult.findMany({
          where: {
            OR: [
              { userId },
              ...(userEmail ? [{ user: { email: userEmail } }] : [])
            ]
          },
          orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(results, { status: 200 });
      } catch (dbErr) {
        console.warn("DB fetch failed, falling back to local results");
      }
    }

    const localResults = getLocalResults(userId, userEmail);
    return NextResponse.json(localResults, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
