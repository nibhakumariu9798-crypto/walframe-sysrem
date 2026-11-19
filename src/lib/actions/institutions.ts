"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { logAuditEvent } from "./audit";
import { InstitutionType } from "@/types";

export interface CreateInstitutionInput {
  name: string;
  institution_type: InstitutionType;
  registration_number: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  contact_email: string;
  contact_phone: string;
  capacity: number;
}

export async function createInstitutionAction(input: CreateInstitutionInput) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl || supabaseUrl.includes("placeholder")) {
    return { success: true, message: "Enrolled in local demo state." };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("institutions")
    .insert({
      ...input,
      current_occupancy: 0,
      verification_status: "pending",
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  await logAuditEvent(user?.id || null, "INSTITUTION_REGISTERED", "institutions", data.id, {
    name: input.name,
    type: input.institution_type,
  });

  revalidatePath("/institutions");
  revalidatePath("/dashboard");
  return { success: true, data };
}

export async function verifyInstitutionAction(id: string, status: "verified" | "rejected") {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl || supabaseUrl.includes("placeholder")) {
    return { success: true };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("institutions")
    .update({ verification_status: status })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  await logAuditEvent(user?.id || null, "INSTITUTION_VERIFICATION", "institutions", id, { status });

  revalidatePath("/institutions");
  revalidatePath("/dashboard");
  return { success: true };
}
