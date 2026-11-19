import { createClient } from "@/lib/supabase/client";
import { Institution, InstitutionType } from "@/types";

export interface NewInstitutionPayload {
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

export async function getVerifiedInstitutions(): Promise<Institution[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("institutions")
      .select("*")
      .order("name", { ascending: true });

    if (!error && data) {
      return data as Institution[];
    }
  } catch (err) {
    console.warn("Could not query institutions from Supabase directly:", err);
  }

  return [];
}

/**
 * Create a new institution record in Supabase.
 */
export async function registerInstitutionInSupabase(
  payload: NewInstitutionPayload
): Promise<Institution | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("institutions")
    .insert([
      {
        ...payload,
        current_occupancy: 0,
        verification_status: "pending",
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Failed to register institution in Supabase:", error);
    throw new Error(error.message);
  }

  return data as Institution;
}
