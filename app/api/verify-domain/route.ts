import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getDomain } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { url, action, email, code } = await req.json();
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const domain = getDomain(url);
    if (!domain || domain === "default") {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (action === "request-code") {
      if (!email || !email.endsWith(`@${domain}`)) {
        return NextResponse.json(
          { error: `Please provide an email address suffix with @${domain}` },
          { status: 400 },
        );
      }

      const verificationCode = Math.floor(
        100000 + Math.random() * 900000,
      ).toString();
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

      await prisma.verifiedDomain.upsert({
        where: { userId_domain: { userId: user.id, domain } },
        update: {
          verificationEmail: email,
          verificationCode,
          codeExpiresAt: expiresAt,
          verified: false,
        },
        create: {
          userId: user.id,
          domain,
          verificationEmail: email,
          verificationCode,
          codeExpiresAt: expiresAt,
          verified: false,
        },
      });

      // MOCK EMAIL SENDING
      console.log(
        `[VERIFICATION CODE for ${domain}] Sent to ${email}: ${verificationCode}`,
      );

      return NextResponse.json({
        success: true,
        message: "Verification code sent to your email.",
      });
    }

    if (action === "verify-code") {
      if (!code) {
        return NextResponse.json(
          { error: "Verification code is required" },
          { status: 400 },
        );
      }

      const verifiedDomain = await prisma.verifiedDomain.findFirst({
        where: { userId: user.id, domain, deleted: false },
      });
      // TODO: Remove this dummy verification code after testing
      if (
        !verifiedDomain ||
        (verifiedDomain.verificationCode !== code && code !== "111111")
      ) {
        return NextResponse.json(
          { error: "Invalid verification code" },
          { status: 400 },
        );
      }

      if (
        code !== "111111" &&
        verifiedDomain.codeExpiresAt &&
        verifiedDomain.codeExpiresAt < new Date()
      ) {
        return NextResponse.json(
          { error: "Verification code has expired" },
          { status: 400 },
        );
      }

      await prisma.verifiedDomain.update({
        where: { id: verifiedDomain.id },
        data: {
          verified: true,
          verificationCode: null,
          codeExpiresAt: null,
        },
      });

      return NextResponse.json({
        success: true,
        message: "Domain verified successfully!",
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Verify API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, verificationToken: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const domains = await prisma.verifiedDomain.findMany({
      where: { userId: user.id, deleted: false },
    });

    return NextResponse.json({
      domains,
      verificationToken: user.verificationToken,
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
