"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function register(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");

  if (password !== confirmPassword) {
    throw new Error("Passwords do not match");
  }

  const res = await fetch("http://api-gateway:8080/api/v1/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    console.log("###########");
    console.log("Registration failed: " + res.status + " " + res.statusText);
    throw new Error(
      "Registration failed: " + res.status + " " + res.statusText,
    );
  }

    const cookieHeader = res.headers.get("set-cookie");

  if (cookieHeader) {
    const tokenMatch = cookieHeader.match(/AUTH_TOKEN=([^;]+)/i);

    if (tokenMatch && tokenMatch[1]) {
      const tokenValue = tokenMatch[1];
      const cookieStore = await cookies();

      cookieStore.set({
        name: "AUTH_TOKEN",
        value: tokenValue,
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
        maxAge: 15 * 60,
      });
    }
  }

  redirect("/profile/create");
}