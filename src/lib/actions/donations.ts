"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { logAuditEvent } from "./audit";

export interface RecordDonationInput {
  institution_id: string;
  donation_type: "monetary" | "in_kind";
  category: "food" | "clothing" | "medicine" | "budget" | "general";
  amount_inr?: number | null;
  item_description?: string;
  quantity?: number | null;
  unit?: string | null;
  allocated_purpose?: string;
  is_anonymous: boolean;
}

export async function recordDonationAction(input: RecordDonationInput) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl || supabaseUrl.includes("placeholder")) {
    return { success: true };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const receiptNumber = `RCPT-2026-03-${Math.floor(1000 + Math.random() * 9000)}`;

  const { data, error } = await supabase
    .from("donations")
    .insert({
      donor_id: input.is_anonymous ? null : user?.id || null,
      institution_id: input.institution_id,
      donation_type: input.donation_type,
      category: input.category,
      amount_inr: input.amount_inr || null,
      item_description: input.item_description,
      quantity: input.quantity || null,
      unit: input.unit || null,
      status: "received",
      receipt_number: receiptNumber,
      is_anonymous: input.is_anonymous,
      allocated_purpose: input.allocated_purpose || null,
      donated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  await logAuditEvent(user?.id || null, "DONATION_RECORDED", "donations", data.id, {
    receipt: receiptNumber,
    amount: input.amount_inr,
  });

  revalidatePath("/donations");
  revalidatePath("/dashboard");
  return { success: true, data };
}
