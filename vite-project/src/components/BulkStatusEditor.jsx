import { useState, useEffect } from 'react';

function BulkStatusEditor({ technologies = [], onUpdate, onCancel }) {
    // состояние для выбранных технологий (массив ID)
    const [selectedIds, setSelectedIds] = useState([]);

    // состояние для нового статуса
    const [newStatus, setNewStatus] = useState('');

    // состояние для фильтра
    const [filter, setFilter] = useState({
        category: 'all',
        currentStatus: 'all',
        searchTerm: ''
    });

    // состояние для подтверждения
    const [showConfirmation, setShowConfirmation] = useState(false);

    // сообщения об успехе/ошибке
    const [message, setMessage] = useState('');

    // доступные статусы
    const statusOptions = [
        { value: 'not_started', label: 'Не начато' },
        { value: 'in_progress', label: 'В процессе' },
        { value: 'completed', label: 'Завершено' },
        { value: 'paused', label: 'На паузе' },
        { value: 'abandoned', label: 'Отменено' }
    ];

    // фильтрация технологий
    const filteredTechnologies = technologies.filter(tech => {
        const matchesCategory = filter.category === 'all' || tech.category === filter.category;
        const matchesStatus = filter.currentStatus === 'all' || tech.status === filter.currentStatus;
        const matchesSearch = !filter.searchTerm || 
            tech.title.toLowerCase().includes(filter.searchTerm.toLowerCase());
        
        return matchesCategory && matchesStatus && matchesSearch;
    });

    // обработчик выбора всех технологий
    const handleSelectAll = () => {
        if (selectedIds.length === filteredTechnologies.length) {
            // если все выбраны, снимаем выбор
            setSelectedIds([]);
        } else {
            // выбираем все отфильтрованные
            setSelectedIds(filteredTechnologies.map(tech => tech.id));
        }
    };

    // обработчик выбора отдельной технологии
    const handleToggleSelect = (id) => {
        setSelectedIds(prev => {
            if (prev.includes(id)) {
                return prev.filter(selectedId => selectedId !== id);
            } else {
                return [...prev, id];
            }
        });
    };

    // обработчик изменения фильтра
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilter(prev => ({
            ...prev,
            [name]: value
        }));
        // сбрасываем выбор при изменении фильтра
        setSelectedIds([]);
    };

    // обработчик применения изменений
    const handleApply = () => {
        if (selectedIds.length === 0) {
            setMessage('Выберите хотя бы одну технологию');
            setTimeout(() => setMessage(''), 3000);
            return;
        }

        if (!newStatus) {
            setMessage('Выберите новый статус');
            setTimeout(() => setMessage(''), 3000);
            return;
        }

        setShowConfirmation(true);
    };

    // подтверждение и применение изменений
    const handleConfirmApply = () => {
        const updatedTechnologies = technologies.map(tech => {
            if (selectedIds.includes(tech.id)) {
                return {
                    ...tech,
                    status: newStatus,
                    lastUpdated: new Date().toISOString()
                };
            }
            return tech;
        });

        onUpdate(updatedTechnologies);
        
        setMessage(`Статус обновлен для ${selectedIds.length} технологий`);
        setTimeout(() => {
            setMessage('');
            setSelectedIds([]);
            setNewStatus('');
        }, 3000);
        
        setShowConfirmation(false);
    };

    // отмена подтверждения
    const handleCancelConfirmation = () => {
        setShowConfirmation(false);
    };

    // получение названия статуса
    const getStatusLabel = (value) => {
        const status = statusOptions.find(opt => opt.value === value);
        return status ? status.label : value;
    };

    // проверка, все ли технологии выбраны
    const allSelected = filteredTechnologies.length > 0 && 
        selectedIds.length === filteredTechnologies.length;

    // проверка, есть ли выбранные технологии
    const someSelected = selectedIds.length > 0 && !allSelected;

    return (
        <div className="bulk-status-editor">
            <h2>Массовое редактирование статусов</h2>

            {/* сообщение о статусе */}
            {message && (
                <div className="status-message" role="status" aria-live="polite">
                    {message}
                </div>
            )}

            {/* фильтры */}
            <div className="filters-section" role="search">
                <h3>Фильтры</h3>
                
                <div className="filter-group">
                    <label htmlFor="category-filter">Категория</label>
                    <select
                        id="category-filter"
                        name="category"
                        value={filter.category}
                        onChange={handleFilterChange}
                    >
                        <option value="all">Все категории</option>
                        <option value="frontend">Frontend</option>
                        <option value="backend">Backend</option>
                        <option value="database">База данных</option>
                        <option value="devops">DevOps</option>
                        <option value="other">Другое</option>
                    </select>
                </div>

                <div className="filter-group">
                    <label htmlFor="status-filter">Текущий статус</label>
                    <select
                        id="status-filter"
                        name="currentStatus"
                        value={filter.currentStatus}
                        onChange={handleFilterChange}
                    >
                        <option value="all">Все статусы</option>
                        {statusOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <label htmlFor="search-filter">Поиск по названию</label>
                    <input
                        id="search-filter"
                        name="searchTerm"
                        type="text"
                        value={filter.searchTerm}
                        onChange={handleFilterChange}
                        placeholder="Введите название..."
                        aria-describedby="search-hint"
                    />
                    <span id="search-hint" className="field-hint">
                        Найдено: {filteredTechnologies.length}
                    </span>
                </div>
            </div>

            {/* выбор нового статуса */}
            <div className="new-status-section">
                <h3>Новый статус</h3>
                <div className="status-selector">
                    <label htmlFor="new-status">Выберите статус для применения</label>
                    <select
                        id="new-status"
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                        aria-describedby="new-status-hint"
                    >
                        <option value="">-- Выберите статус --</option>
                        {statusOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                    <span id="new-status-hint" className="field-hint">
                        Этот статус будет применен ко всем выбранным технологиям
                    </span>
                </div>
            </div>

            {/* список технологий */}
            <div className="technologies-section">
                <div className="section-header">
                    <h3>
                        Технологии
                        <span className="selection-count" aria-live="polite">
                            ({selectedIds.length} выбрано)
                        </span>
                    </h3>
                    
                    {filteredTechnologies.length > 0 && (
                        <div className="select-all">
                            <input
                                type="checkbox"
                                id="select-all"
                                checked={allSelected}
                                ref={(input) => {
                                    if (input) {
                                        input.indeterminate = someSelected;
                                    }
                                }}
                                onChange={handleSelectAll}
                                aria-label="Выбрать все технологии"
                            />
                            <label htmlFor="select-all">
                                {allSelected ? 'Снять выбор со всех' : 'Выбрать все'}
                            </label>
                        </div>
                    )}
                </div>

                {filteredTechnologies.length === 0 ? (
                    <p className="no-results">
                        Технологии не найдены. Попробуйте изменить фильтры.
                    </p>
                ) : (
                    <ul className="technologies-list" role="listbox" aria-multiselectable="true">
                        {filteredTechnologies.map(tech => {
                            const isSelected = selectedIds.includes(tech.id);
                            
                            return (
                                <li 
                                    key={tech.id} 
                                    className={`technology-item ${isSelected ? 'selected' : ''}`}
                                    role="option"
                                    aria-selected={isSelected}
                                >
                                    <input
                                        type="checkbox"
                                        id={`tech-${tech.id}`}
                                        checked={isSelected}
                                        onChange={() => handleToggleSelect(tech.id)}
                                        aria-label={`Выбрать ${tech.title}`}
                                    />
                                    <label htmlFor={`tech-${tech.id}`} className="technology-info">
                                        <span className="tech-title">{tech.title}</span>
                                        <span className="tech-meta">
                                            {tech.category} • {getStatusLabel(tech.status || 'not_started')}
                                        </span>
                                    </label>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>

            {/* кнопки действий */}
            <div className="actions">
                <button
                    type="button"
                    onClick={handleApply}
                    className="btn-primary"
                    disabled={selectedIds.length === 0 || !newStatus}
                    aria-disabled={selectedIds.length === 0 || !newStatus}
                >
                    Применить изменения ({selectedIds.length})
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="btn-secondary"
                >
                    Закрыть
                </button>
            </div>

            {/* модальное окно подтверждения */}
            {showConfirmation && (
                <div 
                    className="confirmation-modal" 
                    role="dialog" 
                    aria-labelledby="confirm-title"
                    aria-describedby="confirm-description"
                    aria-modal="true"
                >
                    <div className="modal-content">
                        <h3 id="confirm-title">Подтверждение изменений</h3>
                        <p id="confirm-description">
                            Вы действительно хотите изменить статус для {selectedIds.length} 
                            {selectedIds.length === 1 ? ' технологии' : selectedIds.length < 5 ? ' технологий' : ' технологий'} 
                            на "{getStatusLabel(newStatus)}"?
                        </p>
                        
                        <div className="selected-technologies">
                            <strong>Выбранные технологии:</strong>
                            <ul>
                                {technologies
                                    .filter(tech => selectedIds.includes(tech.id))
                                    .map(tech => (
                                        <li key={tech.id}>
                                            {tech.title} 
                                            <span className="status-change">
                                                ({getStatusLabel(tech.status || 'not_started')} → {getStatusLabel(newStatus)})
                                            </span>
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>

                        <div className="modal-actions">
                            <button
                                type="button"
                                onClick={handleConfirmApply}
                                className="btn-primary"
                                autoFocus
                            >
                                Подтвердить
                            </button>
                            <button
                                type="button"
                                onClick={handleCancelConfirmation}
                                className="btn-secondary"
                            >
                                Отмена
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BulkStatusEditor;