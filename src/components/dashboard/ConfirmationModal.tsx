"use client";

import React from "react";
import { Button } from "@heroui/react";
import { X, AlertTriangle, AlertCircle, HelpCircle, Loader2 } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void | Promise<any>;
  onClose: () => void;
  type?: "warning" | "danger" | "info" | "success";
  isLoading?: boolean;
}

interface StyleConfig {
  bg: string;
  text: string;
  btn: string;
  Icon: React.ComponentType<{ className?: string }>;
}

export default function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onClose,
  type = "warning",
  isLoading = false,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  const typeStyles: Record<"warning" | "danger" | "info" | "success", StyleConfig> = {
    danger: {
      bg: "bg-red-500/10 border-red-500/20",
      text: "text-red-400",
      btn: "bg-red-500 hover:bg-red-600 text-white shadow-md shadow-red-500/25",
      Icon: AlertCircle,
    },
    warning: {
      bg: "bg-yellow-500/10 border-yellow-500/20",
      text: "text-yellow-400",
      btn: "bg-yellow-500 hover:bg-yellow-600 text-black font-bold shadow-md shadow-yellow-500/25",
      Icon: AlertTriangle,
    },
    success: {
      bg: "bg-green-500/10 border-green-500/20",
      text: "text-green-400",
      btn: "bg-green-500 hover:bg-green-600 text-white shadow-md shadow-green-500/25",
      Icon: HelpCircle,
    },
    info: {
      bg: "bg-blue-500/10 border-blue-500/20",
      text: "text-blue-400",
      btn: "bg-primary hover:bg-primary-dark text-white shadow-md shadow-primary/25",
      Icon: HelpCircle,
    },
  };

  const currentStyles = typeStyles[type] || typeStyles.warning;
  const IconComponent = currentStyles.Icon;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn" onClick={onClose}>
      <div
        className="w-full max-w-md bg-[#0f0f1a] border border-border/40 rounded-2xl shadow-2xl overflow-hidden animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/20 bg-surface-light/5">
          <div className="flex items-center gap-2.5">
            <div className={`flex h-8 w-8 items-center justify-center rounded-lg border ${currentStyles.bg}`}>
              <IconComponent className={`h-4.5 w-4.5 ${currentStyles.text}`} />
            </div>
            <h3 className="text-sm font-bold text-white tracking-tight">{title}</h3>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="h-8 w-8 flex items-center justify-center rounded-lg border border-border/30 text-text-muted hover:text-white hover:border-border transition-colors cursor-pointer disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5">
          <p className="text-xs text-text-muted leading-relaxed font-semibold">
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 px-6 py-4 bg-surface-light/5 border-t border-border/10">
          <Button
            size="sm"
            onPress={onClose}
            isDisabled={isLoading}
            className="h-9 px-4 bg-surface-light border border-border/30 hover:border-border text-text-muted hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            {cancelLabel}
          </Button>
          <Button
            size="sm"
            onPress={onConfirm}
            isDisabled={isLoading}
            className={`h-9 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${currentStyles.btn}`}
          >
            {isLoading && <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />}
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
