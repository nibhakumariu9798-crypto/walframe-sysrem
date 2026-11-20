"use client";

import React, { useState } from "react";
import { X, Boxes, PackageCheck, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDataStore } from "@/context/data-store-context";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  targetItemId?: string;
}

export function RestockInventoryModal({ isOpen, onClose, targetItemId }: Props) {
  const { inventory, restockItem, addInventoryItem, institutions } = useDataStore();

  const [mode, setMode] = useState<"restock_existing" | "add_new">(
    targetItemId ? "restock_existing" : "restock_existing"
  );
  const [selectedItemId, setSelectedItemId] = useState(targetItemId || inventory[0]?.id || "");
  const [addedAmount, setAddedAmount] = useState(50);

  // New item fields
  const [institutionId, setInstitutionId] = useState(institutions[0]?.id || "");
  const [category, setCategory] = useState<"food" | "clothing" | "medicine" | "hygiene" | "educational">("food");
  const [itemName, setItemName] = useState("");
  const [unit, setUnit] = useState("kg");
  const [reorderThreshold, setReorderThreshold] = useState(100);
  const [initialStock, setInitialStock] = useState(120);

  if (!isOpen) return null;

  const currentItem = inventory.find((i) => i.id === selectedItemId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "restock_existing") {
      if (!selectedItemId || addedAmount <= 0) return;
      restockItem(selectedItemId, Number(addedAmount));
    } else {
      if (!itemName) return;
      addInventoryItem({
        institution_id: institutionId,
        category,
        item_name: itemName,
        current_stock: Number(initialStock),
        unit,
        reorder_threshold: Number(reorderThreshold),
        last_restocked_at: new Date().toISOString(),
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in-50">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
              <Boxes className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Inventory Supply Operations
              </h2>
              <p className="text-[11px] text-slate-500 font-medium">
                Restock existing inventory or catalog new supplies
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
          {/* Mode switch */}
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setMode("restock_existing")}
              className={`flex-1 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                mode === "restock_existing"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Restock Item
            </button>
            <button
              type="button"
              onClick={() => setMode("add_new")}
              className={`flex-1 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                mode === "add_new"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Catalog New Item
            </button>
          </div>

          {mode === "restock_existing" ? (
            <div className="space-y-3.5">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">
                  Select Item to Restock
                </label>
                <select
                  value={selectedItemId}
                  onChange={(e) => setSelectedItemId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {inventory.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.item_name} (Current: {item.current_stock} {item.unit})
                    </option>
                  ))}
                </select>
              </div>

              {currentItem && (
                <div className="p-3 bg-slate-50 rounded-xl text-slate-600 text-[11px] space-y-1 border border-slate-200">
                  <div className="flex justify-between">
                    <span>Category:</span>
                    <strong className="capitalize text-slate-900">{currentItem.category}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Current Stock:</span>
                    <strong className="text-slate-900">{currentItem.current_stock} {currentItem.unit}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Reorder Threshold:</span>
                    <strong className="text-slate-900">{currentItem.reorder_threshold} {currentItem.unit}</strong>
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">
                  Quantity Received ({currentItem?.unit || "units"})
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={addedAmount}
                  onChange={(e) => setAddedAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-bold text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3.5">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">
                  Care Home
                </label>
                <select
                  value={institutionId}
                  onChange={(e) => setInstitutionId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {institutions.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) =>
                      setCategory(e.target.value as "food" | "clothing" | "medicine" | "hygiene" | "educational")
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 capitalize"
                  >
                    <option value="food">Food</option>
                    <option value="clothing">Clothing</option>
                    <option value="medicine">Medicine</option>
                    <option value="hygiene">Hygiene</option>
                    <option value="educational">Educational</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">
                    Unit
                  </label>
                  <input
                    type="text"
                    required
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="kg, boxes, units"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">
                  Item Name
                </label>
                <input
                  type="text"
                  required
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="e.g. Fortified Cooking Oil"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">
                    Initial Stock
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={initialStock}
                    onChange={(e) => setInitialStock(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">
                    Reorder Threshold
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={reorderThreshold}
                    onChange={(e) => setReorderThreshold(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <Button type="button" variant="outline" size="sm" onClick={onClose} className="border-slate-300">
              Cancel
            </Button>
            <Button type="submit" size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">
              <PackageCheck className="w-3.5 h-3.5 mr-1" />
              {mode === "restock_existing" ? "Confirm Restock" : "Save Item"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
