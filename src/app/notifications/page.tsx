"use client";

import React from "react";
import { Bell, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDataStore } from "@/context/data-store-context";
import { formatDate } from "@/lib/utils";

export default function NotificationsPage() {
  const { alerts, acknowledgeAlert } = useDataStore();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Bell className="w-5 h-5 text-indigo-600" />
            In-App Welfare Notifications &amp; Alerts ({alerts.length})
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time notifications for alerts, procurement thresholds, and allocation audits.
          </p>
        </div>

        {alerts.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              alerts.forEach((a) => {
                if (a.status === "pending_review") {
                  acknowledgeAlert(a.id);
                }
              });
            }}
          >
            Mark All as Acknowledged
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="p-0 text-xs">
          {alerts.length === 0 ? (
            <div className="py-16 text-center text-xs text-slate-500">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
              <p className="font-semibold text-slate-700 dark:text-slate-200 text-sm">
                No active notifications or alerts
              </p>
              <p className="text-slate-400 mt-1 max-w-sm mx-auto">
                All welfare systems are operating within nominal thresholds. New inventory, medical, or verification notices will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {alerts.map((n) => {
                const isAck = n.status === "acknowledged";
                return (
                  <div key={n.id} className="p-4 flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900 dark:text-slate-100">
                          {n.title}
                        </span>
                        {!isAck && <Badge variant="indigo">New</Badge>}
                        <Badge
                          variant={
                            n.severity === "high" || n.severity === "critical"
                              ? "danger"
                              : n.severity === "medium"
                              ? "warning"
                              : "secondary"
                          }
                          className="capitalize text-[10px]"
                        >
                          {n.severity}
                        </Badge>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                        {n.description}
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono">
                        {formatDate(n.created_at)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {isAck ? (
                        <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Acknowledged
                        </span>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => acknowledgeAlert(n.id)}
                        >
                          Acknowledge
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
