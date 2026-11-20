import { UserRole } from "@/types";

/**
 * Returns the primary landing route for a specific user role.
 * - Donor -> /dashboard (Donor Impact & Fund Utilization Portal)
 * - Care Home (Institution) -> /institutions (Bed Capacity & Residents Roster)
 * - Doctor -> /health (Clinical Health-Risk Triage & Doctor Vault)
 * - Government -> /dashboard (State Welfare Directorate)
 * - NGO / Volunteer -> /resources (Resource Inventory & Stock Ledger)
 * - Admin -> /dashboard (Full Administrative Console)
 */
export function getRoleRedirectUrl(role?: string | null): string {
  if (!role) return "/dashboard";

  const normalized = role.toLowerCase().trim();

  switch (normalized) {
    case "institution":
      return "/institutions";
    case "doctor":
      return "/health";
    case "donor":
      return "/dashboard";
    case "government":
      return "/dashboard";
    case "ngo":
      return "/resources";
    case "volunteer":
      return "/resources";
    case "admin":
      return "/dashboard";
    default:
      return "/dashboard";
  }
}
