"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { logAuditEvent } from "./audit";
import { BeneficiaryType, Gender } from "@/types";

export interface AdmitBeneficiaryInput {
  institution_id: string;
  beneficiary_type: BeneficiaryType;
  identifier_code: string;
  first_name: string;
  gender: Gender;
  age: number;
  admission_date: string;
  special_needs?: string;
}

export async function admitBeneficiaryAction(input: AdmitBeneficiaryInput) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl || supabaseUrl.includes("placeholder")) {
    return { success: true };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("beneficiaries")
    .insert({
      ...input,
      status: "active",
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  // Increment current occupancy in the institution
  await supabase.rpc("increment_occupancy", { inst_id: input.institution_id });

  await logAuditEvent(user?.id || null, "BENEFICIARY_ADMITTED", "beneficiaries", data.id, {
    identifier_code: input.identifier_code,
    type: input.beneficiary_type,
  });

  revalidatePath("/beneficiaries");
  revalidatePath("/dashboard");
  return { success: true, data };
}
