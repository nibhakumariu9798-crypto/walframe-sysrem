"use server";

import { createClient } from "@/lib/supabase/server";

export async function logAuditEvent(
  actorId: string | null,
  action: string,
  entityType: string,
  entityId?: string | null,
  details?: Record<string, unknown>
) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl || supabaseUrl.includes("placeholder")) {
    return;
  }

  try {
    const supabase = await createClient();
    await supabase.from("audit_logs").insert({
      actor_id: actorId,
      action,
      entity_type: entityType,
      entity_id: entityId || null,
      details: details || {},
      created_at: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Failed to write audit log:", err);
  }
}
