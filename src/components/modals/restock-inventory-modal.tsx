"use client";

import React, { useState } from "react";
import { X, Boxes, PackageCheck } from "lucide-react";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Boxes className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Inventory Supply Operations
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Restock existing inventory or catalog new supplies
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
          {/* Mode switch */}
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setMode("restock_existing")}
              className={`flex-1 py-1.5 rounded-md font-semibold text-xs transition-colors cursor-pointer ${
                mode === "restock_existing"
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-2xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              Restock Item
            </button>
            <button
              type="button"
              onClick={() => setMode("add_new")}
              className={`flex-1 py-1.5 rounded-md font-semibold text-xs transition-colors cursor-pointer ${
                mode === "add_new"
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-2xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              Catalog New Item
            </button>
          </div>

          {mode === "restock_existing" ? (
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Select Item to Restock
                </label>
                <select
                  value={selectedItemId}
                  onChange={(e) => setSelectedItemId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-850 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {inventory.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.item_name} (Current: {item.current_stock} {item.unit})
                    </option>
                  ))}
                </select>
              </div>

              {currentItem && (
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg text-slate-600 dark:text-slate-300 text-[11px] space-y-0.5 border border-slate-100 dark:border-slate-700/60">
                  <div>
                    Category: <strong className="capitalize">{currentItem.category}</strong>
                  </div>
                  <div>
                    Current Stock: <strong>{currentItem.current_stock} {currentItem.unit}</strong>
                  </div>
                  <div>
                    Reorder Threshold: <strong>{currentItem.reorder_threshold} {currentItem.unit}</strong>
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Quantity Received ({currentItem?.unit || "units"})
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={addedAmount}
                  onChange={(e) => setAddedAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-850 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold text-sm"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Institution
                </label>
                <select
                  value={institutionId}
                  onChange={(e) => setInstitutionId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-850 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as "food" | "clothing" | "medicine" | "hygiene" | "educational")}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-850 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="food">Food Provision</option>
                    <option value="medicine">Medicine / Health</option>
                    <option value="clothing">Clothing / Linens</option>
                    <option value="hygiene">Hygiene & Sanitary</option>
                    <option value="educational">Educational Material</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Item Name
                  </label>
                  <input
                    type="text"
                    required
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    placeholder="e.g. Wheat Flour (Atta)"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-850 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Unit
                  </label>
                  <input
                    type="text"
                    required
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="kg, strips..."
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-850 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Initial Stock
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={initialStock}
                    onChange={(e) => setInitialStock(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-850 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Reorder Min
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={reorderThreshold}
                    onChange={(e) => setReorderThreshold(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-850 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              <PackageCheck className="w-3.5 h-3.5 mr-1" />
              {mode === "restock_existing" ? "Confirm Restock" : "Save Item"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
