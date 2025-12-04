import { useState, useEffect } from 'react';

function ImprovedDataImportExport() {
    // состояние для списка технологий
    const [technologies, setTechnologies] = useState([]);

    // состояние для сообщений о статусе операций
    const [status, setStatus] = useState({ message: '', type: '' }); // type: 'success', 'error', 'info'

    // состояние для перетаскивания файла
    const [isDragging, setIsDragging] = useState(false);

    // состояние для деталей последней операции
    const [lastOperation, setLastOperation] = useState(null);

    // загрузка данных из localStorage при монтировании компонента
    useEffect(() => {
        loadFromLocalStorage();
    }, []);

    // функция для отображения сообщения
    const showStatus = (message, type = 'info', duration = 3000) => {
        setStatus({ message, type });
        if (duration > 0) {
            setTimeout(() => setStatus({ message: '', type: '' }), duration);
        }
    };

    // функция загрузки данных из localStorage
    const loadFromLocalStorage = () => {
        try {
            const saved = localStorage.getItem('technologies');
            if (saved) {
                const parsed = JSON.parse(saved);
                
                // валидация загруженных данных
                if (!Array.isArray(parsed)) {
                    throw new Error('Данные в localStorage имеют неверный формат');
                }

                setTechnologies(parsed);
                showStatus(`Загружено ${parsed.length} технологий из localStorage`, 'success');
                setLastOperation({
                    type: 'load',
                    timestamp: new Date().toISOString(),
                    count: parsed.length
                });
            } else {
                showStatus('localStorage пуст', 'info');
            }
        } catch (error) {
            showStatus(`Ошибка загрузки: ${error.message}`, 'error', 5000);
            console.error('Ошибка загрузки из localStorage:', error);
        }
    };

    // функция сохранения данных в localStorage
    const saveToLocalStorage = () => {
        try {
            if (technologies.length === 0) {
                showStatus('Нет данных для сохранения', 'error');
                return;
            }

            localStorage.setItem('technologies', JSON.stringify(technologies));
            showStatus(`Сохранено ${technologies.length} технологий в localStorage`, 'success');
            setLastOperation({
                type: 'save',
                timestamp: new Date().toISOString(),
                count: technologies.length
            });
        } catch (error) {
            if (error.name === 'QuotaExceededError') {
                showStatus('Недостаточно места в localStorage', 'error', 5000);
            } else {
                showStatus(`Ошибка сохранения: ${error.message}`, 'error', 5000);
            }
            console.error('Ошибка сохранения в localStorage:', error);
        }
    };

    // валидация структуры данных технологии
    const validateTechnology = (tech, index) => {
        const errors = [];

        if (!tech || typeof tech !== 'object') {
            errors.push(`Элемент ${index + 1}: не является объектом`);
            return errors;
        }

        // обязательные поля
        if (!tech.title || typeof tech.title !== 'string') {
            errors.push(`Элемент ${index + 1}: отсутствует или некорректно поле "title"`);
        }

        if (!tech.category || typeof tech.category !== 'string') {
            errors.push(`Элемент ${index + 1}: отсутствует или некорректно поле "category"`);
        }

        // валидация типов для необязательных полей
        if (tech.description !== undefined && typeof tech.description !== 'string') {
            errors.push(`Элемент ${index + 1}: поле "description" должно быть строкой`);
        }

        if (tech.difficulty !== undefined && typeof tech.difficulty !== 'string') {
            errors.push(`Элемент ${index + 1}: поле "difficulty" должно быть строкой`);
        }

        if (tech.resources !== undefined && !Array.isArray(tech.resources)) {
            errors.push(`Элемент ${index + 1}: поле "resources" должно быть массивом`);
        }

        return errors;
    };

    // валидация всего массива данных
    const validateImportedData = (data) => {
        const validationResult = {
            isValid: true,
            errors: [],
            warnings: []
        };

        // проверка что это массив
        if (!Array.isArray(data)) {
            validationResult.isValid = false;
            validationResult.errors.push('Данные должны быть массивом');
            return validationResult;
        }

        // проверка что массив не пустой
        if (data.length === 0) {
            validationResult.warnings.push('Массив пустой');
        }

        // валидация каждого элемента
        data.forEach((tech, index) => {
            const techErrors = validateTechnology(tech, index);
            validationResult.errors.push(...techErrors);
        });

        if (validationResult.errors.length > 0) {
            validationResult.isValid = false;
        }

        return validationResult;
    };

    // экспорт данных в JSON-файл
    const exportToJSON = () => {
        try {
            if (technologies.length === 0) {
                showStatus('Нет данных для экспорта', 'error');
                return;
            }

            // создаем объект с метаданными для более полного экспорта
            const exportData = {
                version: '1.0',
                exportDate: new Date().toISOString(),
                count: technologies.length,
                data: technologies
            };

            // преобразуем данные в JSON-строку с форматированием
            const dataStr = JSON.stringify(exportData, null, 2);

            // проверка валидности JSON перед экспортом
            JSON.parse(dataStr); // если невалидный, выбросит ошибку

            // создаем Blob объект из строки
            const dataBlob = new Blob([dataStr], { type: 'application/json' });

            // создаем временную ссылку для скачивания
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            
            // формируем имя файла с датой
            const date = new Date().toISOString().split('T')[0];
            link.download = `technologies_${date}.json`;

            // программно кликаем по ссылке для начала скачивания
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // освобождаем память
            URL.revokeObjectURL(url);

            showStatus(`Экспортировано ${technologies.length} технологий`, 'success');
            setLastOperation({
                type: 'export',
                timestamp: new Date().toISOString(),
                count: technologies.length,
                fileName: link.download
            });
        } catch (error) {
            showStatus(`Ошибка экспорта: ${error.message}`, 'error', 5000);
            console.error('Ошибка экспорта:', error);
        }
    };

    // обработка импорта данных
    const processImportedData = (dataStr, source = 'file') => {
        try {
            // парсинг JSON
            let parsed;
            try {
                parsed = JSON.parse(dataStr);
            } catch (parseError) {
                throw new Error('Файл содержит некорректный JSON');
            }

            // извлекаем массив данных (поддержка разных форматов)
            let importedData;
            if (Array.isArray(parsed)) {
                importedData = parsed;
            } else if (parsed.data && Array.isArray(parsed.data)) {
                importedData = parsed.data;
            } else {
                throw new Error('Неверная структура данных: ожидается массив технологий');
            }

            // валидация данных
            const validation = validateImportedData(importedData);

            if (!validation.isValid) {
                const errorMessage = `Обнаружены ошибки валидации:\n${validation.errors.slice(0, 5).join('\n')}${validation.errors.length > 5 ? `\n... и еще ${validation.errors.length - 5}` : ''}`;
                throw new Error(errorMessage);
            }

            // предупреждения (не блокируют импорт)
            if (validation.warnings.length > 0) {
                console.warn('Предупреждения при импорте:', validation.warnings);
            }

            // успешный импорт
            setTechnologies(importedData);
            
            const sourceText = source === 'drop' ? 'перетаскиванием' : 'через выбор файла';
            showStatus(
                `Успешно импортировано ${importedData.length} технологий ${sourceText}`,
                'success',
                4000
            );

            setLastOperation({
                type: 'import',
                timestamp: new Date().toISOString(),
                count: importedData.length,
                source: source
            });

        } catch (error) {
            showStatus(`Ошибка импорта: ${error.message}`, 'error', 6000);
            console.error('Ошибка импорта:', error);
        }
    };

    // импорт данных из JSON-файла через input
    const importFromJSON = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // проверка типа файла
        if (!file.name.endsWith('.json') && file.type !== 'application/json') {
            showStatus('Пожалуйста, выберите JSON файл', 'error');
            event.target.value = '';
            return;
        }

        // проверка размера файла (максимум 5MB)
        if (file.size > 5 * 1024 * 1024) {
            showStatus('Файл слишком большой (максимум 5MB)', 'error');
            event.target.value = '';
            return;
        }

        const reader = new FileReader();

        reader.onload = (e) => {
            processImportedData(e.target.result, 'file');
        };

        reader.onerror = () => {
            showStatus('Ошибка чтения файла', 'error');
        };

        // запускаем асинхронное чтение файла как текста
        reader.readAsText(file);

        // сбрасываем значение input для возможности повторного импорта того же файла
        event.target.value = '';
    };

    // обработчики drag-and-drop
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        
        if (!file) {
            showStatus('Файл не обнаружен', 'error');
            return;
        }

        // проверка типа файла
        if (!file.name.endsWith('.json') && file.type !== 'application/json') {
            showStatus('Пожалуйста, перетащите JSON файл', 'error');
            return;
        }

        // проверка размера файла
        if (file.size > 5 * 1024 * 1024) {
            showStatus('Файл слишком большой (максимум 5MB)', 'error');
            return;
        }

        const reader = new FileReader();
        
        reader.onload = (event) => {
            processImportedData(event.target.result, 'drop');
        };

        reader.onerror = () => {
            showStatus('Ошибка чтения файла', 'error');
        };

        reader.readAsText(file);
    };

    // очистка данных
    const clearData = () => {
        if (technologies.length === 0) {
            showStatus('Нет данных для очистки', 'info');
            return;
        }

        if (window.confirm(`Вы уверены, что хотите удалить все данные (${technologies.length} технологий)?`)) {
            setTechnologies([]);
            showStatus('Все данные удалены', 'success');
            setLastOperation({
                type: 'clear',
                timestamp: new Date().toISOString(),
                count: technologies.length
            });
        }
    };

    // форматирование даты для отображения
    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="data-import-export">
            <h1>Импорт и экспорт данных</h1>

            {/* статусное сообщение */}
            {status.message && (
                <div 
                    className={`status-message ${status.type}`}
                    role={status.type === 'error' ? 'alert' : 'status'}
                    aria-live="polite"
                >
                    {status.message}
                </div>
            )}

            {/* информация о последней операции */}
            {lastOperation && (
                <div className="last-operation" role="status">
                    <h3>Последняя операция:</h3>
                    <p>
                        <strong>Тип:</strong> {lastOperation.type === 'load' ? 'Загрузка' : 
                                              lastOperation.type === 'save' ? 'Сохранение' : 
                                              lastOperation.type === 'import' ? 'Импорт' : 
                                              lastOperation.type === 'export' ? 'Экспорт' : 'Очистка'}
                    </p>
                    <p><strong>Время:</strong> {formatDate(lastOperation.timestamp)}</p>
                    <p><strong>Количество:</strong> {lastOperation.count}</p>
                    {lastOperation.fileName && (
                        <p><strong>Файл:</strong> {lastOperation.fileName}</p>
                    )}
                </div>
            )}

            {/* кнопки управления */}
            <div className="controls">
                <button 
                    onClick={exportToJSON} 
                    disabled={technologies.length === 0}
                    aria-label="Экспорт данных в JSON файл"
                >
                    Экспорт в JSON
                </button>

                <label className="file-input-label">
                    Импорт из JSON
                    <input
                        type="file"
                        accept=".json,application/json"
                        onChange={importFromJSON}
                        style={{ display: 'none' }}
                        aria-label="Выбрать JSON файл для импорта"
                    />
                </label>

                <button 
                    onClick={saveToLocalStorage} 
                    disabled={technologies.length === 0}
                    aria-label="Сохранить данные в localStorage браузера"
                >
                    Сохранить в localStorage
                </button>

                <button 
                    onClick={loadFromLocalStorage}
                    aria-label="Загрузить данные из localStorage браузера"
                >
                    Загрузить из localStorage
                </button>

                <button 
                    onClick={clearData}
                    disabled={technologies.length === 0}
                    className="btn-danger"
                    aria-label="Очистить все данные"
                >
                    Очистить данные
                </button>
            </div>

            {/* область drag-and-drop */}
            <div
                className={`drop-zone ${isDragging ? 'dragging' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                role="button"
                tabIndex={0}
                aria-label="Область для перетаскивания JSON файла"
            >
                <div className="drop-zone-content">
                    <p className="drop-zone-title">
                        {isDragging ? 'Отпустите файл здесь' : 'Перетащите JSON-файл сюда'}
                    </p>
                    <p className="drop-zone-hint">
                        или используйте кнопку "Импорт из JSON"
                    </p>
                    <p className="drop-zone-format">
                        Поддерживается формат: .json (максимум 5MB)
                    </p>
                </div>
            </div>

            {/* список импортированных технологий */}
            {technologies.length > 0 && (
                <div className="technologies-list">
                    <h2>Загруженные технологии ({technologies.length})</h2>
                    <ul role="list">
                        {technologies.map((tech, index) => (
                            <li key={tech.id || index} role="listitem">
                                <div className="tech-item">
                                    <strong>{tech.title}</strong>
                                    <span className="tech-category">
                                        {tech.category}
                                    </span>
                                    {tech.difficulty && (
                                        <span className="tech-difficulty">
                                            Сложность: {tech.difficulty}
                                        </span>
                                    )}
                                    {tech.status && (
                                        <span className="tech-status">
                                            Статус: {tech.status}
                                        </span>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {technologies.length === 0 && (
                <div className="empty-state">
                    <p>Данные не загружены. Импортируйте JSON файл или загрузите из localStorage.</p>
                </div>
            )}
        </div>
    );
}

export default ImprovedDataImportExport;