// components/QuickActions.jsx
import './QuickActions.css';
import Modal from './Modal';
import { useState } from 'react';

function QuickActions({ onMarkAllCompleted, onResetAll, onRandomSelect, activeFilter, onFilterChange, technologies }) {
    // Функция для отображения названия статуса на русском
    const getStatusLabel = (status) => {
        switch (status) {
            case 'not-started': return 'Не начато';
            case 'in-progress': return 'В процессе';
            case 'completed': return 'Изучено';
            default: return 'Все';
        }
    };

    const [showExportModal, setShowExportModal] = useState(false);

    const handleExport = () => {
        const data = {
            exportedAt: new Date().toISOString(),
            technologies: technologies
        };
        const dataStr = JSON.stringify(data, null, 2);
        // Здесь можно добавить логику для скачивания файла
        console.log('Данные для экспорта:', dataStr);
        setShowExportModal(true);
    };

    return (
        <div className="quick-actions">
            <div className="actions-buttons">
                <button className="action-button mark-all" onClick={onMarkAllCompleted}>
                    Отметить все как выполненные
                </button>
                <button className="action-button reset-all" onClick={onResetAll}>
                    Сбросить все статусы
                </button>
                <button className="action-button random-select" onClick={onRandomSelect}>
                    Случайный выбор
                </button>
                <button className="action-button export-data" onClick={handleExport}>
                    Экспорт данных
                </button>
            </div>
            <div className="filter-buttons">
                <button
                    className={`filter-button ${activeFilter === 'all' ? 'active' : ''}`}
                    onClick={() => onFilterChange('all')}
                >
                    Все
                </button>
                <button
                    className={`filter-button ${activeFilter === 'not-started' ? 'active' : ''}`}
                    onClick={() => onFilterChange('not-started')}
                >
                    {getStatusLabel('not-started')}
                </button>
                <button
                    className={`filter-button ${activeFilter === 'in-progress' ? 'active' : ''}`}
                    onClick={() => onFilterChange('in-progress')}
                >
                    {getStatusLabel('in-progress')}
                </button>
                <button
                    className={`filter-button ${activeFilter === 'completed' ? 'active' : ''}`}
                    onClick={() => onFilterChange('completed')}
                >
                    {getStatusLabel('completed')}
                </button>
            </div>
            
            <Modal
                isOpen={showExportModal}
                onClose={() => setShowExportModal(false)}
                title="Экспорт данных"
            >
                <p>Данные успешно подготовлены для экспорта!</p>
                <p>Проверьте консоль разработчика для просмотра данных.</p>
                <button className="modal-close-button" onClick={() => setShowExportModal(false)}>
                    Закрыть
                </button>
            </Modal>
        </div>
    );
}

export default QuickActions;