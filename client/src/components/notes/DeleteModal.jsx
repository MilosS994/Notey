const DeleteModal = ({ isOpen, onClose, onConfirm, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all duration-100">
      <div className="bg-white text-xs md:text-sm dark:bg-neutral-900 rounded-2xl p-6 sm:p-8 min-w-[320px] max-w-[90vw] shadow-2xl border border-neutral-200 dark:border-neutral-800 relative animate-fade-in">
        <button
          className="absolute top-4 right-4 text-neutral-400 hover:text-red-500 text-2xl cursor-pointer"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <div className="text-center text-sm md:text-base text-gray-800 dark:text-neutral-100">
          {children}
        </div>
        <div className="flex justify-end gap-3 mt-8">
          <button
            className="px-5 py-2 rounded-xl bg-neutral-100 text-neutral-700 hover:bg-neutral-200 transition-all font-medium shadow-sm cursor-pointer w-full max-w-1/2"
            onClick={onClose}
          >
            No
          </button>
          <button
            className="px-5 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-all font-medium shadow-md cursor-pointer w-full max-w-1/2"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>

      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.2s cubic-bezier(.4,0,.2,1);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(16px) scale(.98);}
          to { opacity: 1; transform: translateY(0) scale(1);}
        }
      `}</style>
    </div>
  );
};

export default DeleteModal;
