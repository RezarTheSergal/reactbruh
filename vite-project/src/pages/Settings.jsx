// pages/Settings.jsx
import { useState } from 'react';
import './Settings.css'; // Создайте этот файл для стилей, если нужно

function Settings() {
    const [theme, setTheme] = useState('light'); // 'light' или 'dark'
    const [notifications, setNotifications] = useState(true);
    const [autoSave, setAutoSave] = useState(true);

    const handleSave = () => {
        // В реальном приложении здесь сохранялись бы настройки в localStorage или на сервер
        alert('Настройки сохранены!');
    };

    const handleReset = () => {
        if (window.confirm('Вы уверены, что хотите сбросить все данные? Это действие нельзя отменить.')) {
            localStorage.removeItem('technologies');
            localStorage.removeItem('settings');
            alert('Все данные сброшены. Приложение перезагрузится.');
            window.location.reload();
        }
    };

    return (
        <div className="page">
            <div className="page-header">
                <h1>Настройки приложения</h1>
                <p>Управляйте параметрами трекера технологий</p>
            </div>

            <div className="settings-form">
                <div className="setting-group">
                    <h3>Внешний вид</h3>
                    <div className="setting-item">
                        <label htmlFor="theme">Тема оформления:</label>
                        <select 
                            id="theme" 
                            value={theme} 
                            onChange={(e) => setTheme(e.target.value)}
                        >
                            <option value="light">Светлая</option>
                            <option value="dark">Тёмная</option>
                        </select>
                    </div>
                </div>

                <div className="setting-group">
                    <h3>Уведомления</h3>
                    <div className="setting-item">
                        <label>
                            <input
                                type="checkbox"
                                checked={notifications}
                                onChange={(e) => setNotifications(e.target.checked)}
                            />
                            Включить уведомления о смене статуса
                        </label>
                    </div>
                </div>

                <div className="setting-group">
                    <h3>Данные</h3>
                    <div className="setting-item">
                        <label>
                            <input
                                type="checkbox"
                                checked={autoSave}
                                onChange={(e) => setAutoSave(e.target.checked)}
                            />
                            Автосохранение заметок
                        </label>
                    </div>
                </div>

                <div className="setting-actions">
                    <button onClick={handleSave} className="btn btn-primary">
                        Сохранить настройки
                    </button>
                    <button onClick={handleReset} className="btn btn-danger">
                        Сбросить все данные
                    </button>
                </div>
            </div>

            <div className="app-info">
                <h3>Информация о приложении</h3>
                <p>Версия: 1.0.0</p>
                <p>Разработчик: Трекер Технологий</p>
                <p>© 2025</p>
            </div>
        </div>
    );
}

export default Settings;