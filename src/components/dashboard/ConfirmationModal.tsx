"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@heroui/react";
import { X, AlertTriangle, AlertCircle, HelpCircle, Loader2 } from "lucide-react";
import { backdropVariants, modalVariants } from "@/lib/animations";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<any>;
  title: string;
  message: string;
  type?: "warning" | "danger" | "success" | "info";
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
}

const typeStyles: Record<string, { icon: React.ReactNode; iconBg: string; btn: string }> = {
  danger: {
    icon: <AlertTriangle className="h-6 w-6 text-error" />,
    iconBg: "bg-error/10 border-error/20",
    btn: "bg-error/90 text-white hover:bg-error border-transparent",
  },
  warning: {
    icon: <AlertCircle className="h-6 w-6 text-warning" />,
    iconBg: "bg-warning/10 border-warning/20",
    btn: "bg-warning/90 text-white hover:bg-warning border-transparent",
  },
  success: {
    icon: <AlertCircle className="h-6 w-6 text-success" />,
    iconBg: "bg-success/10 border-success/20",
    btn: "bg-success/90 text-white hover:bg-success border-transparent",
  },
  info: {
    icon: <HelpCircle className="h-6 w-6 text-primary" />,
    iconBg: "bg-primary/10 border-primary/20",
    btn: "bg-primary/90 text-white hover:bg-primary border-transparent",
  },
};

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = "warning",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isLoading = false,
}: ConfirmationModalProps) {
  const currentStyles = typeStyles[type] || typeStyles.warning;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Panel */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            className="relative w-full max-w-md border border-secondary/20 bg-surface/95 backdrop-blur-2xl rounded-2xl overflow-hidden shadow-2xl z-10"
          >
            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
              className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center rounded-lg text-text-muted hover:bg-surface-light hover:text-white transition-colors cursor-pointer z-10"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </motion.button>

            {/* Content */}
            <div className="p-6">
              {/* Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -15 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 350, damping: 20, delay: 0.1 }}
                className={`flex h-12 w-12 items-center justify-center rounded-xl border ${currentStyles.iconBg} mb-4`}
              >
                {currentStyles.icon}
              </motion.div>

              <motion.h3
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.3 }}
                className="text-lg font-bold text-white mb-2"
              >
                {title}
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="text-sm text-text-muted leading-relaxed"
              >
                {message}
              </motion.p>
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
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button
                  size="sm"
                  onPress={onConfirm}
                  isDisabled={isLoading}
                  className={`h-9 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${currentStyles.btn}`}
                >
                  {isLoading && <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />}
                  {confirmLabel}
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
