import React from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  width?: string;
}

export default function Modal({
  open,
  onClose,
  children,
  width = "w-[450px]",
}: ModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-center items-center bg-black/40"
      onClick={onClose}
    >
      <div
        className={`bg-white dark:bg-gray-900 rounded-lg p-6 shadow-xl ${width}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
