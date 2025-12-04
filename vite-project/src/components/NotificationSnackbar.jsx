import { Snackbar, Alert, IconButton, Slide } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import { useNotification } from './NotificationContext';

// Компонент для анимации появления
function SlideTransition(props) {
    return <Slide {...props} direction="up" />;
}

// Основной компонент уведомлений
function NotificationSnackbar() {
    const { notifications, closeNotification } = useNotification();

    // Функция для получения иконки в зависимости от типа
    const getIcon = (type) => {
        const iconProps = {
            fontSize: 'inherit',
            sx: { mr: 1 }
        };

        switch (type) {
            case 'success':
                return <CheckCircleIcon {...iconProps} />;
            case 'error':
                return <ErrorIcon {...iconProps} />;
            case 'warning':
                return <WarningIcon {...iconProps} />;
            case 'info':
                return <InfoIcon {...iconProps} />;
            default:
                return <InfoIcon {...iconProps} />;
        }
    };

    // Функция для получения severity для MUI Alert
    const getSeverity = (type) => {
        const validTypes = ['success', 'error', 'warning', 'info'];
        return validTypes.includes(type) ? type : 'info';
    };

    return (
        <>
            {notifications.map((notification, index) => (
                <Snackbar
                    key={notification.id}
                    open={notification.open}
                    onClose={() => closeNotification(notification.id)}
                    TransitionComponent={SlideTransition}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center'
                    }}
                    // Позиционирование нескольких уведомлений
                    sx={{
                        position: 'fixed',
                        bottom: `${16 + index * 70}px !important`,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        // Адаптивность для мобильных устройств
                        '@media (max-width: 600px)': {
                            left: '8px',
                            right: '8px',
                            transform: 'none',
                            width: 'calc(100% - 16px)',
                            maxWidth: 'none'
                        }
                    }}
                    // Доступность
                    aria-live="polite"
                    aria-atomic="true"
                >
                    <Alert
                        severity={getSeverity(notification.type)}
                        variant="filled"
                        iconMapping={{
                            success: getIcon('success'),
                            error: getIcon('error'),
                            warning: getIcon('warning'),
                            info: getIcon('info')
                        }}
                        action={
                            <IconButton
                                size="small"
                                aria-label="закрыть уведомление"
                                color="inherit"
                                onClick={() => closeNotification(notification.id)}
                                sx={{
                                    padding: '4px',
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)'
                                    }
                                }}
                            >
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        }
                        sx={{
                            minWidth: '300px',
                            maxWidth: '600px',
                            width: '100%',
                            fontSize: '0.95rem',
                            alignItems: 'center',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                            // Адаптивность для мобильных
                            '@media (max-width: 600px)': {
                                minWidth: 'auto',
                                maxWidth: 'none',
                                fontSize: '0.875rem',
                                '& .MuiAlert-icon': {
                                    fontSize: '1.25rem'
                                }
                            },
                            // Адаптивность для планшетов
                            '@media (min-width: 601px) and (max-width: 960px)': {
                                minWidth: '280px',
                                maxWidth: '500px'
                            },
                            // Стили для разных типов уведомлений
                            ...(notification.type === 'success' && {
                                backgroundColor: '#2e7d32',
                                color: '#fff'
                            }),
                            ...(notification.type === 'error' && {
                                backgroundColor: '#d32f2f',
                                color: '#fff'
                            }),
                            ...(notification.type === 'warning' && {
                                backgroundColor: '#ed6c02',
                                color: '#fff'
                            }),
                            ...(notification.type === 'info' && {
                                backgroundColor: '#0288d1',
                                color: '#fff'
                            })
                        }}
                        role="alert"
                    >
                        {notification.message}
                    </Alert>
                </Snackbar>
            ))}
        </>
    );
}

export default NotificationSnackbar;