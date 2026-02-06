import React, { useEffect, useRef } from 'react';
import { X, Trash2, AlertTriangle } from 'lucide-react';

const DeleteConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  message = "Are you sure you want to delete this item? This action cannot be undone." 
}) => {
  const modalRef = useRef(null);

  // Handle Escape Key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent scrolling
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose} // Close on backdrop click
    >
      <div 
        ref={modalRef}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
        className="w-full max-w-md bg-[#0D0D0D] border border-white/10 rounded-[32px] p-8 shadow-2xl animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header Icon */}
        <div className="flex items-center justify-center w-16 h-16 bg-rose-500/10 rounded-full mb-6 mx-auto">
          <AlertTriangle className="text-rose-500" size={32} />
        </div>

        {/* Content */}
        <div className="text-center space-y-3 mb-8">
          <h3 className="text-xl font-black text-white uppercase tracking-tight">Confirm Deletion</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-4 bg-white/5 hover:bg-white/10 text-white rounded-full font-bold text-xs uppercase tracking-widest transition-all active:scale-95"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 px-6 py-4 bg-rose-600 hover:bg-rose-500 text-white rounded-full font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <Trash2 size={16} />
            Delete Now
          </button>
        </div>

        {/* Close Button (X) */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;