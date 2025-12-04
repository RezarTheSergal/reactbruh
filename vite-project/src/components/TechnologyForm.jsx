import { useState, useEffect } from 'react';
import './TechnologyForm.css';

function TechnologyForm({ onSave, onCancel, initialData = {} }) {
    // состояние формы с начальными значениями или данными для редактирования
    const [formData, setFormData] = useState({
        title: initialData.title || '',
        description: initialData.description || '',
        category: initialData.category || 'frontend',
        difficulty: initialData.difficulty || 'beginner',
        deadline: initialData.deadline || '',
        resources: initialData.resources || ['']
    });
    // состояние для хранения ошибок валидации
    const [errors, setErrors] = useState({});

    // флаг валидности всей формы
    const [isFormValid, setIsFormValid] = useState(false);
    // функция валидации всей формы
    const validateForm = () => {
        const newErrors = {};
        // валидация названия технологии
        if (!formData.title.trim()) {
            newErrors.title = 'Название технологии обязательно';
        } else if (formData.title.trim().length < 2) {
            newErrors.title = 'Название должно содержать минимум 2 символа';
        } else if (formData.title.trim().length > 50) {
            newErrors.title = 'Название не должно превышать 50 символов';
        }
        // валидация описания
        if (!formData.description.trim()) {
            newErrors.description = 'Описание технологии обязательно';
        } else if (formData.description.trim().length < 10) {
            newErrors.description = 'Описание должно содержать минимум 10 символов';
        }
        // валидация дедлайна (не должен быть в прошлом)
        if (formData.deadline) {
            const deadlineDate = new Date(formData.deadline);
            const today = new Date();
            today.setHours(0, 0, 0, 0); // обнуляем время для сравнения только дат

            if (deadlineDate < today) {
                newErrors.deadline = 'Дедлайн не может быть в прошлом';
            }
        }
        // валидация URL-адресов ресурсов
        formData.resources.forEach((resource, index) => {
            if (resource && !isValidUrl(resource)) {
                newErrors[`resource_${index}`] = 'Введите корректный URL';
            }
        });
        setErrors(newErrors);
        setIsFormValid(Object.keys(newErrors).length === 0);
    };
    // проверка корректности URL
    const isValidUrl = (string) => {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    };
    // запуск валидации при каждом изменении formData
    useEffect(() => {
        validateForm();
    }, [formData]);
    // обработчик изменения обычных полей (input, select, textarea)
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    // обработчик изменения конкретного ресурса в массиве
    const handleResourceChange = (index, value) => {
        const newResources = [...formData.resources];
        newResources[index] = value;
        setFormData(prev => ({
            ...prev,
            resources: newResources
        }));
    };
    // добавление нового пустого поля для ресурса
    const addResourceField = () => {
        setFormData(prev => ({
            ...prev,
            resources: [...prev.resources, '']
        }));
    };
    // удаление поля ресурса по индексу (минимум одно поле должно остаться)
    const removeResourceField = (index) => {
        if (formData.resources.length > 1) {
            const newResources = formData.resources.filter((_, i) => i !== index);
            setFormData(prev => ({
                ...prev,
                resources: newResources
            }));
        }
    };
    // обработчик отправки формы
    const handleSubmit = (e) => {
        e.preventDefault();

        if (isFormValid) {
            // очищаем пустые ресурсы перед сохранением
            const cleanedData = {
                ...formData,
                resources: formData.resources.filter(resource => resource.trim() !== '')
            };

            onSave(cleanedData);
        }
    };
    return (
        <form onSubmit={handleSubmit} className="technology-form" noValidate>
            <h2>{initialData.title ? 'Редактирование технологии' : 'Добавление новой технологии'}</h2>
            {/* поле названия */}
            <div className="form-group">
                <label htmlFor="title" className="required">
                    Название технологии
                </label>
                <input
                    id="title"
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleChange}
                    className={errors.title ? 'error' : ''}
                    placeholder="Например: React, Node.js, TypeScript"
                    aria-describedby={errors.title ? 'title-error' : undefined}
                    required
                />
                {errors.title && (
                    <span id="title-error" className="error-message" role="alert">
                        {errors.title}
                    </span>
                )}
            </div>
            {/* поле описания */}
            <div className="form-group">
                <label htmlFor="description" className="required">Описание
                </label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    className={errors.description ? 'error' : ''}
                    placeholder="Опишите, что это за технология и зачем её изучать..."
                    aria-describedby={errors.description ? 'description-error' : undefined}
                    required
                />
                {errors.description && (
                    <span id="description-error" className="error-message" role="alert">
                        {errors.description}
                    </span>
                )}
            </div>
            {/* выбор категории */}
            <div className="form-group">
                <label htmlFor="category">Категория</label>
                <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                >
                    <option value="frontend">Frontend</option>
                    <option value="backend">Backend</option>
                    <option value="database">База данных</option>
                    <option value="devops">DevOps</option>
                    <option value="other">Другое</option>
                </select>
            </div>
            {/* выбор сложности */}
            <div className="form-group">
                <label htmlFor="difficulty">Сложность</label>
                <select
                    id="difficulty"
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleChange}
                >
                    <option value="beginner">Начальный</option>
                    <option value="intermediate">Средний</option>
                    <option value="advanced">Продвинутый</option>
                </select>
            </div>
            {/* дедлайн */}
            <div className="form-group"><label htmlFor="deadline">Дедлайн (необязательно)</label>
                <input
                    id="deadline"
                    name="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={handleChange}
                    className={errors.deadline ? 'error' : ''}
                    aria-describedby={errors.deadline ? 'deadline-error' : undefined}
                />
                {errors.deadline && (
                    <span id="deadline-error" className="error-message" role="alert">
                        {errors.deadline}
                    </span>
                )}
            </div>
            {/* список ресурсов для изучения */}
            <div className="form-group">
                <label>Ресурсы для изучения</label>
                {formData.resources.map((resource, index) => (
                    <div key={index} className="resource-field">
                        <input
                            type="url"
                            value={resource}
                            onChange={(e) => handleResourceChange(index, e.target.value)}
                            placeholder="https://example.com"
                            className={errors[`resource_${index}`] ? 'error' : ''}
                            aria-describedby={errors[`resource_${index}`] ? `resource-${index}-
error` : undefined}
                        />
                        {formData.resources.length > 1 && (
                            <button
                                type="button"
                                onClick={() => removeResourceField(index)}
                                className="btn-remove"
                                aria-label={`Удалить ресурс ${index + 1}`}
                            >
                                Удалить
                            </button>
                        )}
                        {errors[`resource_${index}`] && (
                            <span id={`resource-${index}-error`} className="error-message"
                                role="alert">
                                {errors[`resource_${index}`]}
                            </span>
                        )}
                    </div>
                ))}
                <button
                    type="button"
                    onClick={addResourceField}
                    className="btn-add-resource"
                >+ Добавить ресурс
                </button>
            </div>
            {/* кнопки действий */}
            <div className="form-actions">
                <button
                    type="submit"
                    className="btn-primary"
                    disabled={!isFormValid}
                >
                    Сохранить
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
export default TechnologyForm;