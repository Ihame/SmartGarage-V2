import React, { useEffect, useRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  hideCloseButton?: boolean;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md', hideCloseButton = false }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden'; // Prevent background scroll
      document.addEventListener('keydown', handleEscape);
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
      document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus(); // Focus the modal for accessibility
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 transition-opacity duration-300 ease-out"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      <div 
        ref={modalRef}
        tabIndex={-1} // Make modal focusable
        className={`bg-slate-800 rounded-xl shadow-2xl w-full ${sizeClasses[size]} transform transition-all duration-300 ease-out flex flex-col max-h-[90vh]
                    opacity-0 translate-y-4 data-[open=true]:opacity-100 data-[open=true]:translate-y-0`}
        data-open={isOpen} // For state-driven animation trigger
      >
        {(title || !hideCloseButton) && (
          <div className="flex justify-between items-center p-5 border-b border-slate-700 flex-shrink-0">
            {title && <h2 id="modal-title" className="text-xl font-semibold text-emerald-400">{title}</h2>}
            {!hideCloseButton && (
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-200 transition-colors rounded-full p-1 hover:bg-slate-700"
                aria-label="Close modal"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}
        <div className="p-5 md:p-6 overflow-y-auto flex-grow">
            {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
