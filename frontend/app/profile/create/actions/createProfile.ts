"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function createProfile(formData: FormData) {
  const cookieStore = await cookies();
  const token = cookieStore.get("AUTH_TOKEN")?.value;

  if (!token) {
    redirect("/login");
  }

  const res = await fetch("http://api-gateway:8080/api/v1/profile/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `AUTH_TOKEN=${token}`,
    },
    body: JSON.stringify({
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      phone: formData.get("phone"),
      gender: formData.get("gender"),
      nationality: formData.get("nationality"),
      budget: formData.get("budget")
        ? parseFloat(formData.get("budget") as string)
        : null,
      subscriptionStatus: formData.get("subscriptionStatus"),
    }),
  });

  if (res.status === 401) {
    redirect("/login");
  }

  if (!res.ok) {
    throw new Error("Failed to create profile: " + res.status);
  }

  redirect("/profile");
}
