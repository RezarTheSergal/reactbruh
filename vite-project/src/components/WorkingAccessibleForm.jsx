import { useState } from 'react';
import './WorkingAccessibleForm.css';

function WorkingAccessibleForm() {
    // состояния для полей формы
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    // состояния для ошибок
    const [errors, setErrors] = useState({});

    // состояние отправки
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    // валидация формы
    const validateForm = () => {
        const newErrors = {};
        // валидация имени
        if (!name.trim()) {
            newErrors.name = 'Имя обязательно для заполнения';
        } else if (name.trim().length < 2) {
            newErrors.name = 'Имя должно содержать минимум 2 символа';
        }
        // валидация email с помощью регулярного выражения
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            newErrors.email = 'Email обязателен для заполнения';
        } else if (!emailRegex.test(email)) {
            newErrors.email = 'Введите корректный email адрес';
        }
        // валидация сообщения
        if (!message.trim()) {
            newErrors.message = 'Сообщение обязательно для заполнения';
        } else if (message.trim().length < 10) {
            newErrors.message = 'Сообщение должно содержать минимум 10 символов';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    // обработчик отправки формы
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            setIsSubmitting(true);

            // имитация отправки на сервер
            await new Promise(resolve => setTimeout(resolve, 1500));

            setIsSubmitting(false); setSubmitSuccess(true);

            // очистка формы после успешной отправки
            setName('');
            setEmail('');
            setMessage('');

            // скрытие сообщения об успехе через 3 секунды
            setTimeout(() => {
                setSubmitSuccess(false);
            }, 3000);
        }
    };
    return (
        <div className="accessible-form-container">
            <h1>Контактная форма</h1>

            {/* область для скринридера - объявляет статус отправки */}
            <div
                role="status"
                aria-live="polite"
                aria-atomic="true"
                className="sr-only"
            >
                {isSubmitting && 'Отправка формы...'}
                {submitSuccess && 'Форма успешно отправлена!'}
            </div>
            {/* визуальное сообщение об успехе */}
            {submitSuccess && (
                <div className="success-message" role="alert">
                    Спасибо! Ваше сообщение успешно отправлено.
                </div>
            )}
            <form onSubmit={handleSubmit} noValidate>
                {/* поле имени */}
                <div className="form-field">
                    <label htmlFor="contact-name">
                        Ваше имя <span aria-label="обязательное поле">*</span>
                    </label>
                    <input
                        id="contact-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        aria-required="true"
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? 'name-error' : undefined}
                        className={errors.name ? 'error' : ''}
                    />
                    {errors.name && (
                        <span id="name-error" className="error-text" role="alert">{errors.name}
                        </span>
                    )}
                </div>
                {/* поле email */}
                <div className="form-field">
                    <label htmlFor="contact-email">
                        Email <span aria-label="обязательное поле">*</span>
                    </label>
                    <input
                        id="contact-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        aria-required="true"
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? 'email-error' : undefined}
                        className={errors.email ? 'error' : ''}
                    />
                    {errors.email && (
                        <span id="email-error" className="error-text" role="alert">
                            {errors.email}
                        </span>
                    )}
                </div>
                {/* поле сообщения */}
                <div className="form-field">
                    <label htmlFor="contact-message">
                        Сообщение <span aria-label="обязательное поле">*</span>
                    </label>
                    <textarea
                        id="contact-message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows="5"
                        aria-required="true"
                        aria-invalid={!!errors.message}
                        aria-describedby={errors.message ? 'message-error' : undefined}
                        className={errors.message ? 'error' : ''}
                    />
                    {errors.message && (
                        <span id="message-error" className="error-text" role="alert">
                            {errors.message}
                        </span>
                    )}
                </div>
                {/* кнопка отправки */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    aria-busy={isSubmitting}>
                    {isSubmitting ? 'Отправка...' : 'Отправить'}
                </button>
            </form>
        </div>
    );
}
export default WorkingAccessibleForm;
