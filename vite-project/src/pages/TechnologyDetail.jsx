// pages/TechnologyDetail.js
import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import TechnologyNotes from '../components/TechnologyNotes'; // Импортируем компонент заметок
import './TechnologyDetail.css'; // Импортируем стили для детальной страницы

function TechnologyDetail() {
    const { techId } = useParams();
    const [technology, setTechnology] = useState(null);

    useEffect(() => {
        const saved = localStorage.getItem('technologies');
        if (saved) {
            const technologies = JSON.parse(saved);
            const tech = technologies.find(t => t.id === parseInt(techId));
            setTechnology(tech);
        }
    }, [techId]);

    const updateStatus = (newStatus) => {
        const saved = localStorage.getItem('technologies');
        if (saved) {
            const technologies = JSON.parse(saved);
            const updated = technologies.map(tech =>
                tech.id === parseInt(techId) ? { ...tech, status: newStatus } : tech
            );
            localStorage.setItem('technologies', JSON.stringify(updated));
            // Обновляем локальное состояние для мгновенного отражения изменений
            setTechnology({ ...technology, status: newStatus });
        }
    };

    // Функция для обновления заметок
    const updateNotes = (id, newNotes) => {
        const saved = localStorage.getItem('technologies');
        if (saved) {
            const technologies = JSON.parse(saved);
            const updated = technologies.map(tech =>
                tech.id === id ? { ...tech, notes: newNotes } : tech
            );
            localStorage.setItem('technologies', JSON.stringify(updated));
            // Обновляем локальное состояние
            setTechnology({ ...technology, notes: newNotes });
        }
    };

    if (!technology) {
        return (
            <div className="page">
                <h1>Технология не найдена</h1>
                <p>Технология с ID {techId} не существует.</p>
                <Link to="/technologies" className="btn">
                    ← Назад к списку
                </Link>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="page-header">
                <Link to="/technologies" className="back-link">
                    ← Назад к списку
                </Link>
                <h1>{technology.title}</h1>
            </div>
            <div className="technology-detail">
                <div className="detail-section">
                    <h3>Описание</h3>
                    <p>{technology.description}</p>
                </div>
                <div className="detail-section">
                    <h3>Статус изучения</h3>
                    <div className="status-buttons">
                        <button
                            onClick={() => updateStatus('not-started')}
                            className={technology.status === 'not-started' ? 'active' : ''}
                        >
                            Не начато
                        </button>
                        <button
                            onClick={() => updateStatus('in-progress')}
                            className={technology.status === 'in-progress' ? 'active' : ''}
                        >
                            В процессе
                        </button>
                        <button
                            onClick={() => updateStatus('completed')}
                            className={technology.status === 'completed' ? 'active' : ''}
                        >
                            Завершено
                        </button>
                    </div>
                </div>
                <div className="detail-section">
                    <h3>Мои заметки</h3>
                    <TechnologyNotes
                        notes={technology.notes || ''} // Передаем текущие заметки или пустую строку
                        onNotesChange={updateNotes} // Передаем функцию обновления заметок
                        techId={parseInt(techId)} // Передаем ID текущей технологии
                    />
                </div>
            </div>
        </div>
    );
}

export default TechnologyDetail;