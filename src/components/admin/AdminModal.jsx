// src/components/admin/AdminModal.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Check,
  AlertCircle,
  AlertTriangle,
  Info,
  HelpCircle,
  Loader,
  Maximize2,
  Minimize2,
  Copy,
  Download,
  Share2,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Plus,
  Minus,
  Search,
  Filter,
  Settings,
  RefreshCw,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Save,
  Trash2,
  Edit2,
  Upload,
  Download as DownloadIcon,
  Printer,
  Mail,
  MessageCircle,
  Phone,
  Video,
  Calendar,
  Clock,
  MapPin,
  Link,
  FileText,
  Image,
  Music,
  Video as VideoIcon,
  Code,
  Star,
  Award,
  Crown,
  Shield,
  Zap,
  Flame,
  Heart,
  Brain,
  Target,
  Activity,
  Users,
  UserPlus,
  UserMinus,
  UserCheck,
  UserX,
} from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';
import { toast } from 'react-toastify';

const AdminModal = ({
  isOpen,
  onClose,
  onConfirm,
  onCancel,
  title,
  subtitle,
  children,
  footer,
  size = 'md',
  variant = 'default',
  loading = false,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'gradient',
  cancelVariant = 'outline',
  showConfirm = true,
  showCancel = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  isFullscreen = false,
  onFullscreenToggle,
  className = '',
  contentClassName = '',
  footerClassName = '',
  headerClassName = '',
  animation = true,
  zIndex = 50,
  preventScroll = true,
  onAfterOpen,
  onAfterClose,
}) => {
  const [isFullscreenState, setIsFullscreenState] = useState(isFullscreen);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const modalRef = useRef(null);
  const focusRef = useRef(null);

  // Size mappings
  const sizeMap = {
    xs: {
      width: 'max-w-sm',
      padding: 'p-4',
      titleSize: 'text-lg',
    },
    sm: {
      width: 'max-w-md',
      padding: 'p-5',
      titleSize: 'text-xl',
    },
    md: {
      width: 'max-w-2xl',
      padding: 'p-6',
      titleSize: 'text-2xl',
    },
    lg: {
      width: 'max-w-4xl',
      padding: 'p-6',
      titleSize: 'text-2xl',
    },
    xl: {
      width: 'max-w-6xl',
      padding: 'p-6',
      titleSize: 'text-2xl',
    },
    full: {
      width: 'max-w-full',
      padding: 'p-6',
      titleSize: 'text-2xl',
    },
  };

  // Variant mappings
  const variantMap = {
    default: 'bg-dark-800 border border-white/20',
    primary: 'bg-dark-800 border border-primary-500/30',
    success: 'bg-dark-800 border border-green-500/30',
    warning: 'bg-dark-800 border border-yellow-500/30',
    danger: 'bg-dark-800 border border-red-500/30',
    info: 'bg-dark-800 border border-blue-500/30',
    glass: 'glass-effect border border-white/20',
    gradient: 'bg-gradient-to-br from-dark-800 to-primary-900/30 border border-white/20',
  };

  const sizes = sizeMap[size] || sizeMap.md;
  const variants = variantMap[variant] || variantMap.default;

  // Focus management
  useEffect(() => {
    if (isOpen && focusRef.current) {
      focusRef.current.focus();
    }
  }, [isOpen]);

  // Scroll lock
  useEffect(() => {
    if (isOpen && preventScroll) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, preventScroll]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && closeOnEscape && isOpen) {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape]);

  // Handle after open/close callbacks
  useEffect(() => {
    if (isOpen && onAfterOpen) {
      onAfterOpen();
    }
    if (!isOpen && onAfterClose) {
      onAfterClose();
    }
  }, [isOpen]);

  const handleClose = () => {
    if (loading) return;
    onClose();
  };

  const handleConfirm = async () => {
    if (onConfirm) {
      setIsLoading(true);
      try {
        const res = await onConfirm();
        console.log(res);
        if(res){
          setSuccess('Operation completed successfully');
          setTimeout(() => {
            setSuccess(null);
            handleClose();
          }, 1500);
        }
      } catch (err) {
        setError(err.message || 'An error occurred');
        setTimeout(() => setError(null), 3000);
      } finally {
        setIsLoading(false);
      }
    } else {
      handleClose();
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    handleClose();
  };

  const handleFullscreenToggle = () => {
    const newState = !isFullscreenState;
    setIsFullscreenState(newState);
    if (onFullscreenToggle) {
      onFullscreenToggle(newState);
    }
  };

  const handleCopy = () => {
    const text = document.querySelector('.modal-content')?.textContent || '';
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Content copied to clipboard');
    }).catch(() => {
      toast.error('Failed to copy content');
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: title || 'Modal Content',
        text: document.querySelector('.modal-content')?.textContent || '',
        url: window.location.href,
      }).catch(console.error);
    } else {
      handleCopy();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className={`fixed inset-0 z-${zIndex} flex items-center justify-center p-4`}
          style={{ zIndex: 50 }}
        >
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={closeOnOverlayClick ? handleClose : undefined}
          />

          {/* Modal */}
          <motion.div
            ref={modalRef}
            initial={animation ? { scale: 0.9, opacity: 0, y: 20 } : false}
            animate={animation ? { scale: 1, opacity: 1, y: 0 } : false}
            exit={animation ? { scale: 0.9, opacity: 0, y: 20 } : false}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`
              relative w-full ${sizes.width} 
              ${isFullscreenState ? 'h-full max-h-screen' : 'max-h-[90vh]'}
              rounded-xl shadow-2xl overflow-hidden
              ${variants}
              ${className}
            `}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'modal-title' : undefined}
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <div className={`
                flex items-start justify-between 
                ${sizes.padding} 
                border-b border-white/10
                ${headerClassName}
              `}>
                <div className="flex-1 min-w-0">
                  {title && (
                    <h2
                      id="modal-title"
                      className={`${sizes.titleSize} font-bold text-white truncate`}
                    >
                      {title}
                    </h2>
                  )}
                  {subtitle && (
                    <p className="text-sm text-gray-400 mt-0.5">{subtitle}</p>
                  )}
                </div>

                <div className="flex items-center gap-1 ml-4 flex-shrink-0">
                  {/* Copy button */}
                  <button
                    onClick={handleCopy}
                    className="p-1.5 rounded-lg hover:bg-white/10 transition text-gray-400 hover:text-white"
                    title="Copy content"
                  >
                    <Copy className="w-4 h-4" />
                  </button>

                  {/* Share button */}
                  <button
                    onClick={handleShare}
                    className="p-1.5 rounded-lg hover:bg-white/10 transition text-gray-400 hover:text-white"
                    title="Share"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>

                  {/* Fullscreen button */}
                  <button
                    onClick={handleFullscreenToggle}
                    className="p-1.5 rounded-lg hover:bg-white/10 transition text-gray-400 hover:text-white"
                    title={isFullscreenState ? 'Exit fullscreen' : 'Enter fullscreen'}
                  >
                    {isFullscreenState ? (
                      <Minimize2 className="w-4 h-4" />
                    ) : (
                      <Maximize2 className="w-4 h-4" />
                    )}
                  </button>

                  {/* Close button */}
                  {showCloseButton && (
                    <button
                      ref={focusRef}
                      onClick={handleClose}
                      disabled={loading}
                      className="p-1.5 rounded-lg hover:bg-white/10 transition text-gray-400 hover:text-white disabled:opacity-50"
                      aria-label="Close modal"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Status Messages */}
            {error && (
              <div className="mx-6 mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span className="text-sm text-red-400">{error}</span>
                <button
                  onClick={() => setError(null)}
                  className="ml-auto text-red-400 hover:text-red-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {success && (
              <div className="mx-6 mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span className="text-sm text-green-400">{success}</span>
              </div>
            )}

            {/* Content */}
            <div className={`
              modal-content
              ${sizes.padding}
              ${isFullscreenState ? 'flex-1 overflow-y-auto' : 'overflow-y-auto max-h-[calc(90vh-200px)]'}
              ${contentClassName}
            `}>
              {typeof children === 'function' ? children({ close: handleClose, loading: isLoading }) : children}
            </div>

            {/* Footer */}
            {(footer || showConfirm || showCancel) && (
              <div className={`
                ${sizes.padding}
                border-t border-white/10
                ${footerClassName}
              `}>
                {footer ? (
                  typeof footer === 'function' ? footer({ close: handleClose, loading: isLoading }) : footer
                ) : (
                  <div className="flex flex-wrap items-center justify-end gap-2">
                    {showCancel && (
                      <Button
                        variant={cancelVariant}
                        onClick={handleCancel}
                        disabled={loading}
                      >
                        {cancelText}
                      </Button>
                    )}
                    {showConfirm && (
                      <Button
                        variant={confirmVariant}
                        onClick={handleConfirm}
                        loading={loading || isLoading}
                        disabled={loading || isLoading}
                      >
                        {confirmText}
                      </Button>
                    )}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// Pre-built specialized modals
export const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  ...props
}) => (
  <AdminModal
    isOpen={isOpen}
    onClose={onClose}
    onConfirm={onConfirm}
    title={title}
    variant={variant}
    confirmText={confirmText}
    cancelText={cancelText}
    {...props}
  >
    <div className="flex items-start gap-4">
      <div className="p-3 bg-red-500/10 rounded-full flex-shrink-0">
        <AlertTriangle className="w-6 h-6 text-red-400" />
      </div>
      <div>
        <p className="text-gray-300">{message}</p>
        <p className="text-xs text-gray-400 mt-1">This action is permanent.</p>
      </div>
    </div>
  </AdminModal>
);

export const SuccessModal = ({
  isOpen,
  onClose,
  title = 'Success!',
  message = 'Operation completed successfully.',
  ...props
}) => (
  <AdminModal
    isOpen={isOpen}
    onClose={onClose}
    title={title}
    variant="success"
    confirmText="Done"
    showCancel={false}
    {...props}
  >
    <div className="flex items-center gap-4">
      <div className="p-3 bg-green-500/10 rounded-full flex-shrink-0">
        <CheckCircle className="w-6 h-6 text-green-400" />
      </div>
      <p className="text-gray-300">{message}</p>
    </div>
  </AdminModal>
);

export const ErrorModal = ({
  isOpen,
  onClose,
  title = 'Error',
  message = 'Something went wrong.',
  ...props
}) => (
  <AdminModal
    isOpen={isOpen}
    onClose={onClose}
    title={title}
    variant="danger"
    confirmText="Close"
    showCancel={false}
    {...props}
  >
    <div className="flex items-center gap-4">
      <div className="p-3 bg-red-500/10 rounded-full flex-shrink-0">
        <AlertCircle className="w-6 h-6 text-red-400" />
      </div>
      <p className="text-gray-300">{message}</p>
    </div>
  </AdminModal>
);

export const InfoModal = ({
  isOpen,
  onClose,
  title = 'Information',
  message = 'Here is some information.',
  ...props
}) => (
  <AdminModal
    isOpen={isOpen}
    onClose={onClose}
    title={title}
    variant="info"
    confirmText="Got it"
    showCancel={false}
    {...props}
  >
    <div className="flex items-center gap-4">
      <div className="p-3 bg-blue-500/10 rounded-full flex-shrink-0">
        <Info className="w-6 h-6 text-blue-400" />
      </div>
      <p className="text-gray-300">{message}</p>
    </div>
  </AdminModal>
);

export const LoadingModal = ({
  isOpen,
  title = 'Loading...',
  message = 'Please wait while we process your request.',
  ...props
}) => (
  <AdminModal
    isOpen={isOpen}
    title={title}
    showConfirm={false}
    showCancel={false}
    showCloseButton={false}
    {...props}
  >
    <div className="text-center py-8">
      <Loader className="w-12 h-12 text-primary-400 animate-spin mx-auto mb-4" />
      <p className="text-gray-300">{message}</p>
    </div>
  </AdminModal>
);

export default AdminModal;