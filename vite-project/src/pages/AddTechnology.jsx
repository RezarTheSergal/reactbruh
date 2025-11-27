// pages/AddTechnology.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddTechnology.css'; // Импортируем файл стилей (можно создать отдельно или использовать общие)

function AddTechnology() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('not-started');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!title.trim()) {
            alert('Пожалуйста, введите название технологии.');
            return;
        }

        // Генерируем уникальный ID (простой способ - текущее время)
        const newId = Date.now();

        // Создаем новую технологию
        const newTechnology = {
            id: newId,
            title: title.trim(),
            description: description.trim(),
            status: status,
            notes: '' // По умолчанию заметки пустые
        };

        // Получаем существующие технологии из localStorage
        const saved = localStorage.getItem('technologies');
        let technologies = [];
        if (saved) {
            technologies = JSON.parse(saved);
        }

        // Добавляем новую технологию в массив
        technologies.push(newTechnology);

        // Сохраняем обновленный список в localStorage
        localStorage.setItem('technologies', JSON.stringify(technologies));

        // Очищаем форму
        setTitle('');
        setDescription('');
        setStatus('not-started');

        // Перенаправляем на страницу списка технологий
        navigate('/technologies');
    };

    return (
        <div className="page">
            <div className="page-header">
                <h1>Добавить новую технологию</h1>
                <button
                    onClick={() => navigate('/technologies')}
                    className="btn btn-secondary"
                >
                    ← Назад к списку
                </button>
            </div>

            <form onSubmit={handleSubmit} className="add-technology-form">
                <div className="form-group">
                    <label htmlFor="title">Название технологии *</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Введите название технологии"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description">Описание</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Введите описание технологии"
                        rows="4"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="status">Статус изучения</label>
                    <select
                        id="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="not-started">Не начато</option>
                        <option value="in-progress">В процессе</option>
                        <option value="completed">Завершено</option>
                    </select>
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn btn-primary">
                        Добавить технологию
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setTitle('');
                            setDescription('');
                            setStatus('not-started');
                        }}
                        className="btn btn-outline"
                    >
                        Очистить форму
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AddTechnology;