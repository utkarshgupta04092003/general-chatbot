"use server";

import { prisma } from "@/lib/prisma";

export async function createEnquiry(
  email: string,
  plan: string,
  description?: string,
  mobile?: string,
) {
  // Simple server-side email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { success: false, error: "Please enter a valid email address." };
  }

  try {
    const enquiry = await prisma.enquiry.create({
      data: {
        email,
        mobile,
        plan,
        description,
      },
    });
    return { success: true, id: enquiry.id };
  } catch (error) {
    console.error("Enquiry error:", error);
    return {
      success: false,
      error: "Something went wrong. Please try again later.",
    };
  }
}
