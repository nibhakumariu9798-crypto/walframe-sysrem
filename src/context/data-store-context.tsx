"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Institution,
  Beneficiary,
  InventoryItem,
  Donation,
  Alert,
  AuditLog,
  ResourceRecord,
  Prediction,
} from "@/types";
import { useRole } from "./role-context";
import { createClient } from "@/lib/supabase/client";
import {
  DEMO_INSTITUTIONS,
  DEMO_BENEFICIARIES,
  DEMO_INVENTORY,
  DEMO_DONATIONS,
  DEMO_ALERTS,
  DEMO_PREDICTIONS,
  DEMO_RESOURCE_RECORDS,
} from "@/lib/demo-data";

interface DataStoreContextType {
  institutions: Institution[];
  beneficiaries: Beneficiary[];
  inventory: InventoryItem[];
  donations: Donation[];
  alerts: Alert[];
  auditLogs: AuditLog[];
  resourceRecords: ResourceRecord[];
  predictions: Prediction[];
  refreshData: () => Promise<void>;
  // Institutions
  addInstitution: (inst: Omit<Institution, "id" | "created_at" | "updated_at">) => void;
  updateInstitutionStatus: (id: string, status: "verified" | "rejected" | "pending") => void;
  // Beneficiaries
  addBeneficiary: (ben: Omit<Beneficiary, "id" | "created_at" | "updated_at">) => void;
  updateBeneficiaryStatus: (id: string, status: "active" | "transferred" | "discharged") => void;
  // Inventory
  restockItem: (id: string, addedStock: number) => void;
  addInventoryItem: (item: Omit<InventoryItem, "id" | "created_at" | "updated_at">) => void;
  // Donations
  addDonation: (don: Omit<Donation, "id" | "created_at">) => void;
  updateDonationStatus: (id: string, status: "pledged" | "received" | "allocated" | "utilized") => void;
  // Alerts
  acknowledgeAlert: (id: string, resolutionNotes?: string) => void;
  addAlert: (alert: Omit<Alert, "id" | "created_at">) => void;
  // Predictions
  addPrediction: (prediction: Omit<Prediction, "id" | "created_at">) => void;
}

const DataStoreContext = createContext<DataStoreContextType | undefined>(undefined);

export function DataStoreProvider({ children }: { children: React.ReactNode }) {
  const { currentProfile } = useRole();

  const [institutions, setInstitutions] = useState<Institution[]>(DEMO_INSTITUTIONS);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>(DEMO_BENEFICIARIES);
  const [inventory, setInventory] = useState<InventoryItem[]>(DEMO_INVENTORY);
  const [donations, setDonations] = useState<Donation[]>(DEMO_DONATIONS);
  const [alerts, setAlerts] = useState<Alert[]>(DEMO_ALERTS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [resourceRecords, setResourceRecords] = useState<ResourceRecord[]>(DEMO_RESOURCE_RECORDS);
  const [predictions, setPredictions] = useState<Prediction[]>(DEMO_PREDICTIONS);

  // Load real data from Supabase tables with demo fallback
  async function loadRealData() {
    try {
      const supabase = createClient();

      // 1. Fetch real institutions from Supabase
      const { data: instData } = await supabase
        .from("institutions")
        .select("*")
        .order("created_at", { ascending: false });

      if (instData && instData.length > 0) {
        setInstitutions(instData as Institution[]);
      }

      // 2. Fetch real beneficiaries from Supabase
      const { data: benData } = await supabase
        .from("beneficiaries")
        .select("*")
        .order("created_at", { ascending: false });

      if (benData && benData.length > 0) {
        setBeneficiaries(benData as Beneficiary[]);
      }

      // 3. Fetch real donations from Supabase
      const { data: donData } = await supabase
        .from("donations")
        .select("*")
        .order("created_at", { ascending: false });

      if (donData && donData.length > 0) {
        setDonations(donData as Donation[]);
      }

      // 4. Fetch real inventory items from Supabase
      const { data: invData } = await supabase
        .from("inventory_items")
        .select("*")
        .order("created_at", { ascending: false });

      if (invData && invData.length > 0) {
        setInventory(invData as InventoryItem[]);
      }

      // 5. Fetch real alerts from Supabase
      const { data: alertData } = await supabase
        .from("alerts")
        .select("*")
        .order("created_at", { ascending: false });

      if (alertData && alertData.length > 0) {
        setAlerts(alertData as Alert[]);
      }

      // 6. Fetch real audit logs from Supabase
      const { data: logData } = await supabase
        .from("audit_logs")
        .select("*")
        .order("created_at", { ascending: false });

      if (logData && logData.length > 0) {
        setAuditLogs(logData as AuditLog[]);
      }

      // 7. Fetch real historical resource records from Supabase
      const { data: recData } = await supabase
        .from("resource_records")
        .select("*")
        .order("record_year", { ascending: false });

      if (recData && recData.length > 0) {
        setResourceRecords(recData as ResourceRecord[]);
      }

      // 8. Fetch real predictions from Supabase
      const { data: predData } = await supabase
        .from("predictions")
        .select("*")
        .order("created_at", { ascending: false });

      if (predData && predData.length > 0) {
        setPredictions(predData as Prediction[]);
      }
    } catch (err) {
      console.warn("Could not fetch real Supabase data, using verified synthetic demo baseline:", err);
    }
  }

  useEffect(() => {
    loadRealData();
  }, [currentProfile?.id]);

  const logAudit = (action: string, entityType: string, entityId: string, details?: Record<string, unknown>) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      actor_id: currentProfile.id || "guest-session",
      action,
      entity_type: entityType,
      entity_id: entityId,
      details,
      ip_address: "127.0.0.1",
      created_at: new Date().toISOString(),
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    // Asynchronously attempt to log into Supabase audit_logs
    try {
      const supabase = createClient();
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(currentProfile.id);
      supabase.from("audit_logs").insert({
        actor_id: isUUID ? currentProfile.id : null,
        action,
        entity_type: entityType,
        entity_id: entityId.startsWith("inst-") || entityId.startsWith("ben-") || entityId.startsWith("pred-") ? null : entityId,
        details: details || {},
        ip_address: "127.0.0.1",
      }).then(() => {});
    } catch {
      // Safe non-blocking audit write
    }
  };

  // --- INSTITUTION ACTIONS ---
  const addInstitution = async (data: Omit<Institution, "id" | "created_at" | "updated_at">) => {
    const tempId = `inst-${Date.now()}`;
    const newInst: Institution = {
      ...data,
      id: tempId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setInstitutions((prev) => [newInst, ...prev]);
    logAudit("INSTITUTION_REGISTERED", "institutions", newInst.id, { name: newInst.name });

    try {
      const supabase = createClient();
      const { data: inserted, error } = await supabase
        .from("institutions")
        .insert({
          name: data.name,
          institution_type: data.institution_type,
          registration_number: data.registration_number,
          address: data.address,
          city: data.city,
          state: data.state,
          pincode: data.pincode,
          contact_email: data.contact_email,
          contact_phone: data.contact_phone,
          capacity: data.capacity,
          current_occupancy: data.current_occupancy,
          verification_status: data.verification_status,
        })
        .select()
        .single();

      if (!error && inserted) {
        setInstitutions((prev) =>
          prev.map((inst) => (inst.id === tempId ? (inserted as Institution) : inst))
        );
      }
    } catch (err) {
      console.warn("Failed to persist institution to Supabase:", err);
    }
  };

  const updateInstitutionStatus = async (id: string, status: "verified" | "rejected" | "pending") => {
    setInstitutions((prev) =>
      prev.map((inst) => (inst.id === id ? { ...inst, verification_status: status } : inst))
    );
    logAudit("INSTITUTION_STATUS_UPDATED", "institutions", id, { status });

    try {
      const supabase = createClient();
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
      if (isUUID) {
        await supabase.from("institutions").update({ verification_status: status }).eq("id", id);
      }
    } catch (err) {
      console.warn("Could not sync institution status to Supabase:", err);
    }
  };

  // --- BENEFICIARY ACTIONS ---
  const addBeneficiary = async (data: Omit<Beneficiary, "id" | "created_at" | "updated_at">) => {
    const tempId = `ben-${Date.now()}`;
    const newBen: Beneficiary = {
      ...data,
      id: tempId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setBeneficiaries((prev) => [newBen, ...prev]);
    setInstitutions((prev) =>
      prev.map((i) =>
        i.id === data.institution_id ? { ...i, current_occupancy: i.current_occupancy + 1 } : i
      )
    );
    logAudit("BENEFICIARY_ADMITTED", "beneficiaries", newBen.id, {
      identifier_code: newBen.identifier_code,
      type: newBen.beneficiary_type,
    });

    try {
      const supabase = createClient();
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(data.institution_id);

      const { data: inserted, error } = await supabase
        .from("beneficiaries")
        .insert({
          institution_id: isUUID ? data.institution_id : "24af4f81-d923-49a2-84f6-703c1b193827",
          beneficiary_type: data.beneficiary_type,
          identifier_code: data.identifier_code,
          first_name: data.first_name,
          gender: data.gender,
          age: data.age,
          admission_date: data.admission_date,
          status: data.status,
          special_needs: data.special_needs,
        })
        .select()
        .single();

      if (!error && inserted) {
        setBeneficiaries((prev) =>
          prev.map((b) => (b.id === tempId ? (inserted as Beneficiary) : b))
        );
        // Sync increment occupancy in Supabase
        if (isUUID) {
          const targetInst = institutions.find((i) => i.id === data.institution_id);
          if (targetInst) {
            await supabase
              .from("institutions")
              .update({ current_occupancy: targetInst.current_occupancy + 1 })
              .eq("id", data.institution_id);
          }
        }
      }
    } catch (err) {
      console.warn("Failed to persist beneficiary to Supabase:", err);
    }
  };

  const updateBeneficiaryStatus = async (id: string, status: "active" | "transferred" | "discharged") => {
    const currentBen = beneficiaries.find((b) => b.id === id);
    const oldStatus = currentBen?.status;

    setBeneficiaries((prev) =>
      prev.map((ben) => (ben.id === id ? { ...ben, status } : ben))
    );

    // Adjust care home bed occupancy accordingly
    if (oldStatus === "active" && status !== "active" && currentBen?.institution_id) {
      setInstitutions((prev) =>
        prev.map((inst) =>
          inst.id === currentBen.institution_id
            ? { ...inst, current_occupancy: Math.max(0, inst.current_occupancy - 1) }
            : inst
        )
      );
    } else if (oldStatus !== "active" && status === "active" && currentBen?.institution_id) {
      setInstitutions((prev) =>
        prev.map((inst) =>
          inst.id === currentBen.institution_id
            ? { ...inst, current_occupancy: inst.current_occupancy + 1 }
            : inst
        )
      );
    }

    logAudit("BENEFICIARY_STATUS_CHANGED", "beneficiaries", id, { oldStatus, newStatus: status });

    try {
      const supabase = createClient();
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
      if (isUUID) {
        await supabase.from("beneficiaries").update({ status }).eq("id", id);

        // Also sync updated occupancy to institutions table
        if (currentBen?.institution_id) {
          const instUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(currentBen.institution_id);
          if (instUUID) {
            const inst = institutions.find((i) => i.id === currentBen.institution_id);
            if (inst) {
              const delta = (oldStatus === "active" && status !== "active") ? -1 : (oldStatus !== "active" && status === "active") ? 1 : 0;
              if (delta !== 0) {
                await supabase
                  .from("institutions")
                  .update({ current_occupancy: Math.max(0, inst.current_occupancy + delta) })
                  .eq("id", currentBen.institution_id);
              }
            }
          }
        }
      }
    } catch (err) {
      console.warn("Could not sync beneficiary status to Supabase:", err);
    }
  };

  // --- INVENTORY ACTIONS ---
  const restockItem = async (id: string, addedStock: number) => {
    const targetItem = inventory.find((i) => i.id === id);
    const newStock = (targetItem?.current_stock || 0) + addedStock;

    setInventory((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              current_stock: newStock,
              last_restocked_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }
          : item
      )
    );
    logAudit("INVENTORY_RESTOCKED", "inventory_items", id, { addedStock, newStock });

    // If item was low stock and is now above threshold, resolve related low stock alerts
    if (targetItem && newStock >= targetItem.reorder_threshold) {
      setAlerts((prev) =>
        prev.map((a) =>
          a.alert_type === "stock_shortage" &&
          a.title.toLowerCase().includes(targetItem.item_name.toLowerCase()) &&
          a.status === "pending_review"
            ? { ...a, status: "resolved", resolution_notes: `Restocked with +${addedStock} units` }
            : a
        )
      );
    }

    try {
      const supabase = createClient();
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
      if (isUUID) {
        await supabase
          .from("inventory_items")
          .update({
            current_stock: newStock,
            last_restocked_at: new Date().toISOString(),
          })
          .eq("id", id);
      }
    } catch (err) {
      console.warn("Could not sync restock to Supabase:", err);
    }
  };

  const addInventoryItem = async (data: Omit<InventoryItem, "id" | "created_at" | "updated_at">) => {
    const tempId = `inv-${Date.now()}`;
    const newItem: InventoryItem = {
      ...data,
      id: tempId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setInventory((prev) => [newItem, ...prev]);
    logAudit("INVENTORY_ITEM_CREATED", "inventory_items", newItem.id, { name: newItem.item_name });

    try {
      const supabase = createClient();
      const isInstUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(data.institution_id);

      const { data: inserted, error } = await supabase
        .from("inventory_items")
        .insert({
          institution_id: isInstUUID ? data.institution_id : "24af4f81-d923-49a2-84f6-703c1b193827",
          category: data.category,
          item_name: data.item_name,
          current_stock: data.current_stock,
          unit: data.unit,
          reorder_threshold: data.reorder_threshold,
          last_restocked_at: data.last_restocked_at || new Date().toISOString(),
        })
        .select()
        .single();

      if (!error && inserted) {
        setInventory((prev) =>
          prev.map((i) => (i.id === tempId ? (inserted as InventoryItem) : i))
        );
      }
    } catch (err) {
      console.warn("Failed to persist inventory item to Supabase:", err);
    }
  };

  // --- DONATION ACTIONS ---
  const addDonation = async (data: Omit<Donation, "id" | "created_at">) => {
    const tempId = `don-${Date.now()}`;
    const newDonation: Donation = {
      ...data,
      id: tempId,
      created_at: new Date().toISOString(),
    };
    setDonations((prev) => [newDonation, ...prev]);
    logAudit("DONATION_RECORDED", "donations", newDonation.id, {
      receipt: newDonation.receipt_number,
      amount: newDonation.amount_inr,
    });

    try {
      const supabase = createClient();
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(data.institution_id);
      const isDonorUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(currentProfile.id);

      const { data: inserted, error } = await supabase
        .from("donations")
        .insert({
          donor_id: isDonorUUID ? currentProfile.id : null,
          institution_id: isUUID ? data.institution_id : "24af4f81-d923-49a2-84f6-703c1b193827",
          donation_type: data.donation_type,
          category: data.category,
          amount_inr: data.amount_inr,
          item_description: data.item_description,
          quantity: data.quantity,
          unit: data.unit,
          status: data.status,
          receipt_number: data.receipt_number,
          is_anonymous: data.is_anonymous,
          allocated_purpose: data.allocated_purpose,
        })
        .select()
        .single();

      if (!error && inserted) {
        setDonations((prev) =>
          prev.map((d) => (d.id === tempId ? (inserted as Donation) : d))
        );
      }
    } catch (err) {
      console.warn("Failed to persist donation to Supabase:", err);
    }
  };

  const updateDonationStatus = async (
    id: string,
    status: "pledged" | "received" | "allocated" | "utilized"
  ) => {
    setDonations((prev) =>
      prev.map((don) => (don.id === id ? { ...don, status } : don))
    );
    logAudit("DONATION_STATUS_UPDATED", "donations", id, { status });

    try {
      const supabase = createClient();
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
      if (isUUID) {
        await supabase.from("donations").update({ status }).eq("id", id);
      }
    } catch (err) {
      console.warn("Could not sync donation status to Supabase:", err);
    }
  };

  // --- ALERT ACTIONS ---
  const acknowledgeAlert = (id: string, resolutionNotes?: string) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              status: "acknowledged",
              acknowledged_by: currentProfile.id,
              acknowledged_at: new Date().toISOString(),
              resolution_notes: resolutionNotes || "Reviewed and actioned by personnel.",
            }
          : a
      )
    );
    logAudit("ALERT_ACKNOWLEDGED", "alerts", id, { resolutionNotes });
  };

  const addAlert = async (data: Omit<Alert, "id" | "created_at">) => {
    const tempId = `alt-${Date.now()}`;
    const newAlert: Alert = {
      ...data,
      id: tempId,
      created_at: new Date().toISOString(),
    };
    setAlerts((prev) => [newAlert, ...prev]);
    logAudit("ALERT_CREATED", "alerts", newAlert.id, {
      type: newAlert.alert_type,
      severity: newAlert.severity,
      title: newAlert.title,
    });

    try {
      const supabase = createClient();
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(data.institution_id);
      const isBenUUID = data.beneficiary_id && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(data.beneficiary_id);

      await supabase.from("alerts").insert({
        institution_id: isUUID ? data.institution_id : "24af4f81-d923-49a2-84f6-703c1b193827",
        beneficiary_id: isBenUUID ? data.beneficiary_id : null,
        alert_type: data.alert_type,
        severity: data.severity,
        priority_score: data.priority_score,
        title: data.title,
        description: data.description,
        status: data.status,
        is_synthetic: data.is_synthetic ?? true,
      });
    } catch (err) {
      console.warn("Failed to persist alert to Supabase:", err);
    }
  };

  // --- PREDICTION ACTIONS ---
  const addPrediction = async (data: Omit<Prediction, "id" | "created_at">) => {
    const tempId = `pred-${Date.now()}`;
    const newPred: Prediction = {
      ...data,
      id: tempId,
      created_at: new Date().toISOString(),
    };
    setPredictions((prev) => [newPred, ...prev]);
    logAudit("PREDICTION_GENERATED", "predictions", newPred.id, {
      domain: newPred.prediction_domain,
      target: newPred.target_variable,
      model: newPred.model_name,
    });

    try {
      const supabase = createClient();
      const isInstUUID = data.institution_id && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(data.institution_id);
      const isBenUUID = data.beneficiary_id && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(data.beneficiary_id);

      await supabase.from("predictions").insert({
        institution_id: isInstUUID ? data.institution_id : null,
        beneficiary_id: isBenUUID ? data.beneficiary_id : null,
        prediction_domain: data.prediction_domain,
        target_variable: data.target_variable,
        model_name: data.model_name,
        model_version: data.model_version,
        model_tier: data.model_tier,
        input_features: data.input_features,
        predicted_value: data.predicted_value,
        predicted_class: data.predicted_class,
        confidence_score: data.confidence_score,
        explanation_payload: data.explanation_payload || {},
        is_synthetic: data.is_synthetic ?? true,
      });
    } catch (err) {
      console.warn("Failed to persist prediction to Supabase:", err);
    }
  };

  return (
    <DataStoreContext.Provider
      value={{
        institutions,
        beneficiaries,
        inventory,
        donations,
        alerts,
        auditLogs,
        resourceRecords,
        predictions,
        refreshData: loadRealData,
        addInstitution,
        updateInstitutionStatus,
        addBeneficiary,
        updateBeneficiaryStatus,
        restockItem,
        addInventoryItem,
        addDonation,
        updateDonationStatus,
        acknowledgeAlert,
        addAlert,
        addPrediction,
      }}
    >
      {children}
    </DataStoreContext.Provider>
  );
}

export function useDataStore() {
  const context = useContext(DataStoreContext);
  if (!context) {
    throw new Error("useDataStore must be used within a DataStoreProvider");
  }
  return context;
}
