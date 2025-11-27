import './TechnologyCard.css';
import TechnologyNotes from './TechnologyNotes'; // Импортируем компонент заметок

// Импортируем иконки как модули
import completedIcon from '../assets/completed.png';
import inProgressIcon from '../assets/in-progress.png';
import notStartedIcon from '../assets/not-started.png';

function TechnologyCard({ title, description, status, notes, onStatusChange, onNotesChange, techId }) { // Добавляем пропсы для заметок
    // Определяем классы и текст в зависимости от статуса
    let statusClass = '';
    let statusText = '';
    let statusIcon = '';

    if (status === 'completed') {
        statusClass = 'status-completed';
        statusText = 'Изучено';
        statusIcon = completedIcon;
    } else if (status === 'in-progress') {
        statusClass = 'status-in-progress';
        statusText = 'В процессе';
        statusIcon = inProgressIcon;
    } else if (status === 'not-started') {
        statusClass = 'status-not-started';
        statusText = 'Не начато';
        statusIcon = notStartedIcon;
    }

    return (
        <div
            className={`technology-card ${statusClass}`}
            onClick={onStatusChange} // Обработчик клика
            role="button"
            tabIndex="0"
            aria-label={`Карточка "${title}". Текущий статус: ${statusText}. Нажмите для изменения статуса.`}
        >
            <h3 className="card-title">{title}</h3>
            <p className="card-description">{description}</p>
            <div className="card-status">
                {/* Используем тег img для отображения PNG-иконки */}
                <img src={statusIcon} alt={statusText} className="status-icon" />
                <span className="status-text">{statusText}</span>
            </div>
            {/* Оборачиваем компонент заметок в div с классом для стилизации фона */}
            <div className="notes-wrapper">
                <TechnologyNotes
                    notes={notes} // Передаем текущие заметки
                    onNotesChange={onNotesChange} // Передаем функцию обновления заметок из App
                    techId={techId} // Передаем ID текущей технологии
                />
            </div>
        </div>
    );
}

export default TechnologyCard;