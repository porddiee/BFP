"use server";

import { signUp, signIn, signOut } from "@/services/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function logoutAction() {
  await signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}

export async function registerAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const first_name = formData.get("first_name") as string;
  const last_name = formData.get("last_name") as string;
  const contact_number = formData.get("contact_number") as string;

  // Validation
  if (password !== confirmPassword) {
    return { error: "Passwords do not match" };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters" };
  }

  try {
    await signUp(email, password, {
      first_name,
      last_name,
      contact_number,
    });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Registration failed" };
  }

  redirect("/pending-approval");
}

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    await signIn(email, password);
    revalidatePath("/", "layout");
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Sign in failed" };
  }

  redirect("/dashboard");
}

