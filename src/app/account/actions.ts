"use server";

import { revalidatePath } from "next/cache";

import type { ActionState } from "@/lib/account/types";
import { profileFields, projectFields, requestFields } from "@/lib/account/validation";
import { requireAccountUser } from "@/lib/auth/account";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function saveProfileAction(
  _previousState: ActionState,
  form: FormData,
): Promise<ActionState> {
  const user = await requireAccountUser("/account/profile");
  const fields = profileFields(form);
  if (fields.error) return { status: "error", message: fields.error };

  try {
    const supabase = await createServerSupabaseClient();
    // Only these editable columns are accepted; role and email cannot be changed
    // through a submitted form, even if a caller adds extra fields.
    const { data, error } = await supabase
      .from("profiles")
      .update(fields.data)
      .eq("id", user.id)
      .select("id")
      .maybeSingle();
    if (error || !data) {
      return { status: "error", message: "Your profile could not be saved. Please try again." };
    }
  } catch {
    return { status: "error", message: "Your profile could not be saved. Please try again." };
  }

  revalidatePath("/account", "layout");
  return { status: "success", message: "Your profile has been updated." };
}

export async function createProjectAction(
  _previousState: ActionState,
  form: FormData,
): Promise<ActionState> {
  const user = await requireAccountUser("/account/projects");
  const fields = projectFields(form);
  if (fields.error) return { status: "error", message: fields.error };

  try {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.from("user_projects").insert({
      user_id: user.id,
      name: fields.data.name,
      status: "draft",
    });
    if (error) {
      return { status: "error", message: "Your project could not be created. Please try again." };
    }
  } catch {
    return { status: "error", message: "Your project could not be created. Please try again." };
  }

  revalidatePath("/account", "layout");
  return { status: "success", message: "Your private project draft has been created." };
}

export async function createRequestAction(
  _previousState: ActionState,
  form: FormData,
): Promise<ActionState> {
  const user = await requireAccountUser("/account/requests");
  const fields = requestFields(form);
  if (fields.error) return { status: "error", message: fields.error };

  try {
    const supabase = await createServerSupabaseClient();
    const { data: auth, error: authError } = await supabase.auth.getUser();
    if (authError || auth.user?.id !== user.id || !auth.user.email) {
      return { status: "error", message: "Please sign in again with a verified email to send a request." };
    }

    // An authenticated client and RLS enforce ownership. Status and internal
    // metadata use database defaults, never values submitted by a member.
    const { error } = await supabase.from("contact_inquiries").insert({
      user_id: auth.user.id,
      email: auth.user.email,
      name: user.fullName || auth.user.email,
      company: user.company || null,
      subject: fields.data.subject,
      message: fields.data.message,
    });
    if (error) {
      return { status: "error", message: "Your request could not be saved. Please try again later." };
    }
  } catch {
    return { status: "error", message: "Your request could not be saved. Please try again later." };
  }

  revalidatePath("/account", "layout");
  return { status: "success", message: "Your request has been saved. You can follow its status here." };
}
