import { createContext, useContext, useState, useCallback } from 'react';

// Создаем контекст для уведомлений
const NotificationContext = createContext();

// Хук для использования уведомлений в компонентах
export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification должен использоваться внутри NotificationProvider');
    }
    return context;
};

// Провайдер уведомлений
export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    // Функция для показа уведомления
    const showNotification = useCallback((message, type = 'info', duration = 5000) => {
        const id = Date.now() + Math.random(); // уникальный ID
        
        const notification = {
            id,
            message,
            type, // 'success', 'error', 'warning', 'info'
            duration,
            open: true
        };

        setNotifications(prev => [...prev, notification]);

        // Автоматическое удаление через duration
        if (duration > 0) {
            setTimeout(() => {
                closeNotification(id);
            }, duration);
        }

        return id;
    }, []);

    // Функция для закрытия уведомления
    const closeNotification = useCallback((id) => {
        setNotifications(prev =>
            prev.map(notif =>
                notif.id === id ? { ...notif, open: false } : notif
            )
        );

        // Удаление из массива после анимации закрытия
        setTimeout(() => {
            setNotifications(prev => prev.filter(notif => notif.id !== id));
        }, 300);
    }, []);

    // Вспомогательные функции для разных типов уведомлений
    const showSuccess = useCallback((message, duration) => {
        return showNotification(message, 'success', duration);
    }, [showNotification]);

    const showError = useCallback((message, duration) => {
        return showNotification(message, 'error', duration);
    }, [showNotification]);

    const showWarning = useCallback((message, duration) => {
        return showNotification(message, 'warning', duration);
    }, [showNotification]);

    const showInfo = useCallback((message, duration) => {
        return showNotification(message, 'info', duration);
    }, [showNotification]);

    const value = {
        notifications,
        showNotification,
        closeNotification,
        showSuccess,
        showError,
        showWarning,
        showInfo
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};

export default NotificationContext;