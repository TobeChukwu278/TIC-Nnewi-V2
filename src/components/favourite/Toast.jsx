// Toast.js
import React, { useState, useEffect } from 'react';
import { Check, X, AlertCircle, Info } from 'lucide-react';

const Toast = ({
    message,
    type = 'success',
    isVisible,
    onClose,
    duration = 3000,
    position = 'top-right'
}) => {
    useEffect(() => {
        if (isVisible && duration > 0) {
            const timer = setTimeout(onClose, duration);
            return () => clearTimeout(timer);
        }
    }, [isVisible, duration, onClose]);

    if (!isVisible) return null;

    // Different styles and icons for each type
    const getToastConfig = () => {
        switch (type) {
            case 'success':
                return {
                    bgColor: 'bg-green-500',
                    icon: Check
                };
            case 'error':
                return {
                    bgColor: 'bg-red-500',
                    icon: X
                };
            case 'warning':
                return {
                    bgColor: 'bg-yellow-500',
                    icon: AlertCircle
                };
            case 'info':
                return {
                    bgColor: 'bg-blue-500',
                    icon: Info
                };
            default:
                return {
                    bgColor: 'bg-gray-500',
                    icon: Info
                };
        }
    };

    const { bgColor, icon: Icon } = getToastConfig();

    // Position classes
    const getPositionClasses = () => {
        switch (position) {
            case 'top-left':
                return 'top-4 left-4';
            case 'top-center':
                return 'top-4 left-1/2 transform -translate-x-1/2';
            case 'top-right':
                return 'top-4 right-4';
            case 'bottom-left':
                return 'bottom-4 left-4';
            case 'bottom-center':
                return 'bottom-4 left-1/2 transform -translate-x-1/2';
            case 'bottom-right':
                return 'bottom-4 right-4';
            default:
                return 'top-4 right-4';
        }
    };

    return (
        <div className={`fixed ${getPositionClasses()} z-50 transition-all duration-300 ease-in-out`}>
            <div className={`${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-3 max-w-sm min-w-[250px]`}>
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium flex-1">{message}</span>
                <button
                    onClick={onClose}
                    className="ml-2 hover:bg-black hover:bg-opacity-20 rounded-full p-1 transition-colors"
                    aria-label="Close notification"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default Toast;

// Optional: Hook for easier usage
export const useToast = () => {
    const [toast, setToast] = useState({
        show: false,
        message: '',
        type: 'success'
    });

    const showToast = (message, type = 'success', duration = 3000) => {
        setToast({ show: true, message, type, duration });
    };

    const hideToast = () => {
        setToast({ show: false, message: '', type: 'success' });
    };

    return {
        toast,
        showToast,
        hideToast
    };
};