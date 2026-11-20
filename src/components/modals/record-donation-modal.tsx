"use client";

import React, { useState } from "react";
import { X, HeartHandshake, ShieldCheck } from "lucide-react";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in-50">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Record Welfare Donation
              </h2>
              <p className="text-[11px] text-slate-500 font-medium">
                Log a verified monetary contribution or in-kind supplies
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">
              Target Care Institution *
            </label>
            <select
              value={institutionId}
              onChange={(e) => setInstitutionId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
              <label className="font-semibold text-slate-700">
                Donation Type *
              </label>
              <select
                value={donationType}
                onChange={(e) => setDonationType(e.target.value as "monetary" | "in_kind")}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="monetary">Monetary Fund (₹)</option>
                <option value="in_kind">In-Kind Physical Goods</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">
                Designated Category *
              </label>
              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value as "food" | "clothing" | "medicine" | "budget" | "general")
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="food">Nutritional Food</option>
                <option value="medicine">Medical &amp; Pharma</option>
                <option value="clothing">Clothing &amp; Bedding</option>
                <option value="budget">Operational Budget</option>
                <option value="general">General Support</option>
              </select>
            </div>
          </div>

          {donationType === "monetary" ? (
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">
                Donation Amount (INR ₹) *
              </label>
              <input
                type="number"
                min="100"
                step="500"
                required
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-bold text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          ) : (
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">
                  Physical Item Description *
                </label>
                <input
                  type="text"
                  required
                  value={itemDescription}
                  onChange={(e) => setItemDescription(e.target.value)}
                  placeholder="e.g. 50 Sets of Winter Blankets"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Quantity *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Unit *</label>
                  <input
                    type="text"
                    required
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="sets, boxes, kg..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">
              Allocated Purpose / Program Goal
            </label>
            <input
              type="text"
              value={allocatedPurpose}
              onChange={(e) => setAllocatedPurpose(e.target.value)}
              placeholder="e.g. Q2 Vitamin &amp; Milk Supplement Program"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="is_anon"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            <label htmlFor="is_anon" className="text-slate-600 cursor-pointer font-medium">
              Keep contribution anonymous on public transparency leaderboards
            </label>
          </div>

          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>
              A digitally signed receipt code will be issued. Allocations can be tracked down to individual supply shipments.
            </span>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <Button type="button" variant="outline" size="sm" onClick={onClose} className="border-slate-300">
              Cancel
            </Button>
            <Button type="submit" size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">
              Issue Receipt &amp; Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
