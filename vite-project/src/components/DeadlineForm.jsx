import { useState, useEffect } from 'react';
import './DeadlineForm.css';
function DeadlineForm({ onSave, onCancel, initialData = {} }) {
    // состояние формы с начальными значениями
    const [formData, setFormData] = useState({
        technologyName: initialData.technologyName || '',
        startDate: initialData.startDate || '',
        endDate: initialData.endDate || '',
        hoursPerWeek: initialData.hoursPerWeek || '',
        priority: initialData.priority || 'medium',
        notes: initialData.notes || ''
    });

    // состояние для хранения ошибок валидации
    const [errors, setErrors] = useState({});

    // флаг валидности всей формы
    const [isFormValid, setIsFormValid] = useState(false);

    // функция валидации всей формы
    const validateForm = () => {
        const newErrors = {};

        // валидация названия технологии
        if (!formData.technologyName.trim()) {
            newErrors.technologyName = 'Название технологии обязательно';
        } else if (formData.technologyName.trim().length < 2) {
            newErrors.technologyName = 'Название должно содержать минимум 2 символа';
        } else if (formData.technologyName.trim().length > 100) {
            newErrors.technologyName = 'Название не должно превышать 100 символов';
        }

        // валидация даты начала
        if (!formData.startDate) {
            newErrors.startDate = 'Дата начала обязательна';
        } else {
            const startDate = new Date(formData.startDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (startDate < today) {
                newErrors.startDate = 'Дата начала не может быть в прошлом';
            }
        }

        // валидация даты окончания
        if (!formData.endDate) {
            newErrors.endDate = 'Дата окончания обязательна';
        } else if (formData.startDate && formData.endDate) {
            const startDate = new Date(formData.startDate);
            const endDate = new Date(formData.endDate);

            if (endDate <= startDate) {
                newErrors.endDate = 'Дата окончания должна быть позже даты начала';
            }

            // проверка на разумный период (не более 2 лет)
            const diffTime = Math.abs(endDate - startDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays > 730) {
                newErrors.endDate = 'Период изучения не должен превышать 2 года';
            }

            if (diffDays < 1) {
                newErrors.endDate = 'Минимальный период изучения - 1 день';
            }
        }

        // валидация часов в неделю
        if (!formData.hoursPerWeek) {
            newErrors.hoursPerWeek = 'Количество часов в неделю обязательно';
        } else {
            const hours = parseFloat(formData.hoursPerWeek);
            
            if (isNaN(hours)) {
                newErrors.hoursPerWeek = 'Введите корректное число';
            } else if (hours <= 0) {
                newErrors.hoursPerWeek = 'Количество часов должно быть больше 0';
            } else if (hours > 168) {
                newErrors.hoursPerWeek = 'В неделе всего 168 часов';
            } else if (hours > 60) {
                newErrors.hoursPerWeek = 'Рекомендуется не более 60 часов в неделю';
            }
        }

        // валидация заметок (необязательное поле)
        if (formData.notes && formData.notes.length > 500) {
            newErrors.notes = 'Заметки не должны превышать 500 символов';
        }

        setErrors(newErrors);
        setIsFormValid(Object.keys(newErrors).length === 0);
    };

    // запуск валидации при каждом изменении formData
    useEffect(() => {
        validateForm();
    }, [formData]);

    // обработчик изменения полей формы
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // обработчик отправки формы
    const handleSubmit = (e) => {
        e.preventDefault();

        if (isFormValid) {
            // вычисляем общее количество часов
            const startDate = new Date(formData.startDate);
            const endDate = new Date(formData.endDate);
            const weeks = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24 * 7));
            const totalHours = weeks * parseFloat(formData.hoursPerWeek);

            const dataToSave = {
                ...formData,
                calculatedWeeks: weeks,
                calculatedTotalHours: totalHours
            };

            onSave(dataToSave);
        }
    };

    // вычисление информации о плане для отображения
    const calculatePlanInfo = () => {
        if (formData.startDate && formData.endDate && formData.hoursPerWeek) {
            const startDate = new Date(formData.startDate);
            const endDate = new Date(formData.endDate);
            const weeks = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24 * 7));
            const totalHours = weeks * parseFloat(formData.hoursPerWeek);

            if (!isNaN(totalHours) && weeks > 0) {
                return {
                    weeks,
                    totalHours: totalHours.toFixed(1)
                };
            }
        }
        return null;
    };

    const planInfo = calculatePlanInfo();

    return (
        <form onSubmit={handleSubmit} className="deadline-form" noValidate>
            <h2>{initialData.technologyName ? 'Редактирование сроков изучения' : 'Установка сроков изучения'}</h2>

            {/* поле названия технологии */}
            <div className="form-group">
                <label htmlFor="technologyName" className="required">
                    Название технологии
                </label>
                <input
                    id="technologyName"
                    name="technologyName"
                    type="text"
                    value={formData.technologyName}
                    onChange={handleChange}
                    className={errors.technologyName ? 'error' : ''}
                    placeholder="Например: React Hooks, GraphQL, Docker"
                    aria-describedby={errors.technologyName ? 'technologyName-error' : undefined}
                    aria-required="true"
                    aria-invalid={!!errors.technologyName}
                    required
                />
                {errors.technologyName && (
                    <span id="technologyName-error" className="error-message" role="alert">
                        {errors.technologyName}
                    </span>
                )}
            </div>

            {/* дата начала */}
            <div className="form-group">
                <label htmlFor="startDate" className="required">
                    Дата начала изучения
                </label>
                <input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleChange}
                    className={errors.startDate ? 'error' : ''}
                    aria-describedby={errors.startDate ? 'startDate-error' : undefined}
                    aria-required="true"
                    aria-invalid={!!errors.startDate}
                    required
                />
                {errors.startDate && (
                    <span id="startDate-error" className="error-message" role="alert">
                        {errors.startDate}
                    </span>
                )}
            </div>

            {/* дата окончания */}
            <div className="form-group">
                <label htmlFor="endDate" className="required">
                    Планируемая дата завершения
                </label>
                <input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={handleChange}
                    className={errors.endDate ? 'error' : ''}
                    aria-describedby={errors.endDate ? 'endDate-error' : undefined}
                    aria-required="true"
                    aria-invalid={!!errors.endDate}
                    required
                />
                {errors.endDate && (
                    <span id="endDate-error" className="error-message" role="alert">
                        {errors.endDate}
                    </span>
                )}
            </div>

            {/* часы в неделю */}
            <div className="form-group">
                <label htmlFor="hoursPerWeek" className="required">
                    Часов в неделю
                </label>
                <input
                    id="hoursPerWeek"
                    name="hoursPerWeek"
                    type="number"
                    min="0.5"
                    max="168"
                    step="0.5"
                    value={formData.hoursPerWeek}
                    onChange={handleChange}
                    className={errors.hoursPerWeek ? 'error' : ''}
                    placeholder="Например: 10"
                    aria-describedby={errors.hoursPerWeek ? 'hoursPerWeek-error hoursPerWeek-hint' : 'hoursPerWeek-hint'}
                    aria-required="true"
                    aria-invalid={!!errors.hoursPerWeek}
                    required
                />
                <span id="hoursPerWeek-hint" className="field-hint">
                    Рекомендуется от 5 до 20 часов в неделю
                </span>
                {errors.hoursPerWeek && (
                    <span id="hoursPerWeek-error" className="error-message" role="alert">
                        {errors.hoursPerWeek}
                    </span>
                )}
            </div>

            {/* приоритет */}
            <div className="form-group">
                <label htmlFor="priority">Приоритет</label>
                <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    aria-describedby="priority-hint"
                >
                    <option value="low">Низкий</option>
                    <option value="medium">Средний</option>
                    <option value="high">Высокий</option>
                    <option value="critical">Критический</option>
                </select>
                <span id="priority-hint" className="field-hint">
                    Выберите важность изучения этой технологии
                </span>
            </div>

            {/* заметки */}
            <div className="form-group">
                <label htmlFor="notes">
                    Заметки (необязательно)
                </label>
                <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="4"
                    className={errors.notes ? 'error' : ''}
                    placeholder="Дополнительная информация о плане изучения..."
                    aria-describedby={errors.notes ? 'notes-error notes-hint' : 'notes-hint'}
                    aria-invalid={!!errors.notes}
                    maxLength="500"
                />
                <span id="notes-hint" className="field-hint">
                    {formData.notes.length}/500 символов
                </span>
                {errors.notes && (
                    <span id="notes-error" className="error-message" role="alert">
                        {errors.notes}
                    </span>
                )}
            </div>

            {/* информация о плане */}
            {planInfo && (
                <div className="plan-summary" role="status" aria-live="polite">
                    <h3>Информация о плане:</h3>
                    <p>
                        Продолжительность: <strong>{planInfo.weeks} {planInfo.weeks === 1 ? 'неделя' : planInfo.weeks < 5 ? 'недели' : 'недель'}</strong>
                    </p>
                    <p>
                        Всего часов: <strong>{planInfo.totalHours} ч</strong>
                    </p>
                </div>
            )}

            {/* кнопки действий */}
            <div className="form-actions">
                <button
                    type="submit"
                    className="btn-primary"
                    disabled={!isFormValid}
                    aria-disabled={!isFormValid}
                >
                    Сохранить план
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="btn-secondary"
                >
                    Отмена
                </button>
            </div>
        </form>
    );
}

export default DeadlineForm;