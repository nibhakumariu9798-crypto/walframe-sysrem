"use client";

import React, { useState } from "react";
import { X, HeartHandshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDataStore } from "@/context/data-store-context";
import { useRole } from "@/context/role-context";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function RecordDonationModal({ isOpen, onClose }: Props) {
  const { institutions, addDonation } = useDataStore();
  const { currentProfile } = useRole();

  const [institutionId, setInstitutionId] = useState(institutions[0]?.id || "");
  const [donationType, setDonationType] = useState<"monetary" | "in_kind">("monetary");
  const [category, setCategory] = useState<"food" | "clothing" | "medicine" | "budget" | "general">("food");
  const [amount, setAmount] = useState(25000);
  const [itemDescription, setItemDescription] = useState("");
  const [quantity, setQuantity] = useState(50);
  const [unit, setUnit] = useState("sets");
  const [allocatedPurpose, setAllocatedPurpose] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!institutionId) return;

    const receiptNumber = `RCPT-2026-03-${Math.floor(1000 + Math.random() * 9000)}`;

    addDonation({
      donor_id: isAnonymous ? null : currentProfile.id,
      institution_id: institutionId,
      donation_type: donationType,
      category,
      amount_inr: donationType === "monetary" ? Number(amount) : null,
      item_description:
        donationType === "in_kind"
          ? itemDescription
          : `Monetary grant for ${category} welfare support`,
      quantity: donationType === "in_kind" ? Number(quantity) : null,
      unit: donationType === "in_kind" ? unit : null,
      status: "received",
      receipt_number: receiptNumber,
      is_anonymous: isAnonymous,
      allocated_purpose: allocatedPurpose || "General seasonal welfare allocation",
      donated_at: new Date().toISOString(),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Record Welfare Donation
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Log a monetary contribution or in-kind supplies with audit trail
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-300">
              Target Care Institution
            </label>
            <select
              value={institutionId}
              onChange={(e) => setInstitutionId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-850 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {institutions.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.name} ({i.city})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Donation Type
              </label>
              <select
                value={donationType}
                onChange={(e) => setDonationType(e.target.value as "monetary" | "in_kind")}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-850 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="monetary">Monetary Fund (₹)</option>
                <option value="in_kind">In-Kind Physical Goods</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Designated Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as "food" | "clothing" | "medicine" | "budget" | "general")}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-850 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="food">Nutritional Food</option>
                <option value="medicine">Medical & Pharma</option>
                <option value="clothing">Clothing & Bedding</option>
                <option value="budget">Operational Budget</option>
                <option value="general">General Support</option>
              </select>
            </div>
          </div>

          {donationType === "monetary" ? (
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Donation Amount (INR ₹)
              </label>
              <input
                type="number"
                min="100"
                step="500"
                required
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-850 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-sm"
              />
            </div>
          ) : (
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Physical Item Description
                </label>
                <input
                  type="text"
                  required
                  value={itemDescription}
                  onChange={(e) => setItemDescription(e.target.value)}
                  placeholder="e.g. 50 Sets of Winter Blankets"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-850 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-850 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Unit</label>
                  <input
                    type="text"
                    required
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="sets, boxes, kg..."
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-850 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-300">
              Allocated Purpose / Program Goal
            </label>
            <input
              type="text"
              value={allocatedPurpose}
              onChange={(e) => setAllocatedPurpose(e.target.value)}
              placeholder="e.g. Q2 Vitamin & Milk Supplement Program"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-850 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="anon"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
            <label htmlFor="anon" className="text-slate-700 dark:text-slate-300 cursor-pointer text-[11px]">
              Keep donor identity anonymous on public transparency ledger
            </label>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              <HeartHandshake className="w-3.5 h-3.5 mr-1" /> Record Contribution
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
