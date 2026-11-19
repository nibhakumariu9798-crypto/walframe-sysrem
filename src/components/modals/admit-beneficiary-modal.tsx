"use client";

import React, { useState } from "react";
import { X, UserPlus, Shield, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDataStore } from "@/context/data-store-context";
import { BeneficiaryType, Gender } from "@/types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function AdmitBeneficiaryModal({ isOpen, onClose }: Props) {
  const { institutions, addBeneficiary } = useDataStore();

  const [institutionId, setInstitutionId] = useState(institutions[0]?.id || "");
  const [type, setType] = useState<BeneficiaryType>("child");
  const [firstName, setFirstName] = useState("");
  const [gender, setGender] = useState<Gender>("male");
  const [age, setAge] = useState(type === "child" ? 8 : 74);
  const [specialNeeds, setSpecialNeeds] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !institutionId) return;

    // Generate random privacy code
    const prefix = type === "child" ? "BEN-CH" : "BEN-ELD";
    const rand = Math.floor(100 + Math.random() * 900);
    const identifierCode = `${prefix}-2026-${rand}`;

    addBeneficiary({
      institution_id: institutionId,
      beneficiary_type: type,
      identifier_code: identifierCode,
      first_name: firstName,
      gender,
      age: Number(age),
      admission_date: new Date().toISOString().split("T")[0],
      status: "active",
      special_needs: specialNeeds || "None recorded",
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="bg-white border border-slate-200 rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Admit Resident to Care Home
              </h2>
              <p className="text-[11px] text-slate-500">
                Enroll a child or senior resident with privacy protections
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
            <label className="font-semibold text-slate-700 dark:text-slate-300">
              Host Welfare Institution
            </label>
            <select
              value={institutionId}
              onChange={(e) => setInstitutionId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {institutions.map((inst) => (
                <option key={inst.id} value={inst.id}>
                  {inst.name} ({inst.current_occupancy}/{inst.capacity} beds)
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Resident Category
              </label>
              <select
                value={type}
                onChange={(e) => {
                  const newType = e.target.value as BeneficiaryType;
                  setType(newType);
                  setAge(newType === "child" ? 8 : 74);
                }}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="child">Child Resident</option>
                <option value="elderly">Elderly Senior</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Age (Years)
              </label>
              <input
                type="number"
                min={type === "child" ? 0 : 55}
                max={type === "child" ? 18 : 120}
                required
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Given First Name
              </label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="e.g. Meera"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as Gender)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-300">
              Special Care / Dietary Requirements
            </label>
            <textarea
              rows={2}
              value={specialNeeds}
              onChange={(e) => setSpecialNeeds(e.target.value)}
              placeholder="e.g. Nutritional milk supplement, gentle mobility assistance..."
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="p-3 bg-blue-50/60 dark:bg-blue-950/30 rounded-lg border border-blue-200/80 dark:border-blue-900/60 text-[11px] text-blue-900 dark:text-blue-200 flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <span>
              A privacy-preserving token ID will be auto-generated. Full clinical records are isolated for physicians.
            </span>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              <UserPlus className="w-3.5 h-3.5 mr-1" /> Complete Admission
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
