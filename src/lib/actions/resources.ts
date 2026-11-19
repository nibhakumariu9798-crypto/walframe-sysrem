"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { logAuditEvent } from "./audit";

export async function restockInventoryAction(id: string, addedStock: number) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl || supabaseUrl.includes("placeholder")) {
    return { success: true };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: item } = await supabase
    .from("inventory_items")
    .select("current_stock")
    .eq("id", id)
    .single();

  const newStock = (item?.current_stock || 0) + addedStock;

  const { error } = await supabase
    .from("inventory_items")
    .update({
      current_stock: newStock,
      last_restocked_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  await logAuditEvent(user?.id || null, "INVENTORY_RESTOCKED", "inventory_items", id, { addedStock });

  revalidatePath("/resources");
  revalidatePath("/dashboard");
  return { success: true };
}
