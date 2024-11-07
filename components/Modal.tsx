'use client';

import { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  children: ReactNode;
}

const Modal = ({ isOpen, onClose, title, onConfirm, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl p-6 relative shadow-lg">
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h2 className="text-2xl font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-red-500 text-lg font-semibold hover:text-red-600"
          >
            &times;
          </button>
        </div>

        <div className="overflow-y-auto max-h-96 pr-4">{children}</div>

        <div className="flex justify-between border-t p-4 mt-4">
          <button
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
          >
            Close
          </button>
          {onConfirm && (
            <button
              onClick={onConfirm}
              className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md"
            >
              Confirm
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
