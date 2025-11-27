// pages/TechnologyList.js
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import TechnologyCard from '../components/TechnologyCard'; // Импортируем компонент карточки

function TechnologyList() {
    const [technologies, setTechnologies] = useState([]);
    const [loading, setLoading] = useState(true); // Состояние загрузки

    // Загружаем технологии из localStorage при монтировании компонента
    useEffect(() => {
        const saved = localStorage.getItem('technologies');
        if (saved) {
            setTechnologies(JSON.parse(saved));
        }
        setLoading(false); // Убираем индикатор загрузки
    }, []);

    if (loading) {
        return (
            <div className="page">
                <h1>Загрузка технологий...</h1>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="page-header">
                <h1>Все технологии</h1>
                <Link to="/add-technology" className="btn btn-primary">
                    + Добавить технологию
                </Link>
            </div>

            {technologies.length > 0 ? (
                <div className="technologies-list"> {/* Используем класс для списка, как в App.jsx */}
                    {technologies.map(tech => (
                        <TechnologyCard
                            key={tech.id}
                            techId={tech.id}
                            title={tech.title}
                            description={tech.description}
                            status={tech.status}
                            notes={tech.notes}
                            // Для списка не нужен обработчик изменения статуса, он будет на детальной странице
                            onStatusChange={() => { }} // Заглушка, если компонент карточки ожидает проп
                            onNotesChange={(id, newNotes) => {
                                // Обновляем заметки в localStorage
                                const saved = localStorage.getItem('technologies');
                                if (saved) {
                                    const technologies = JSON.parse(saved);
                                    const updated = technologies.map(t =>
                                        t.id === id ? { ...t, notes: newNotes } : t
                                    );
                                    localStorage.setItem('technologies', JSON.stringify(updated));
                                    // Обновляем локальное состояние
                                    setTechnologies(updated);
                                }
                            }}
                        />
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <p>Технологий пока нет.</p>
                    <Link to="/add-technology" className="btn btn-primary">
                        Добавить первую технологию
                    </Link>
                </div>
            )}
        </div>
    );
}

export default TechnologyList;