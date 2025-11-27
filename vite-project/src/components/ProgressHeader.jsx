import './ProgressHeader.css';

function ProgressHeader({ total, completed, progress }) {
    // Просто используем переданный прогресс
    const calculatedProgress = progress;

    // Определяем стиль прогресс-бара в зависимости от процента
    let barColorClass = '';
    if (calculatedProgress === 100) {
        barColorClass = 'progress-bar-full';
    } else if (calculatedProgress > 50) {
        barColorClass = 'progress-bar-high';
    } else if (calculatedProgress > 0) {
        barColorClass = 'progress-bar-medium';
    } else {
        barColorClass = 'progress-bar-empty';
    }

    return (
        <div className="progress-header">
            <h2 className="progress-title">Прогресс изучения</h2>
            <div className="stats-container">
                <div className="stat-item">
                    <span className="stat-label">Всего технологий:</span>
                    <span className="stat-value">{total}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Изучено:</span>
                    <span className="stat-value">{completed}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Выполнено:</span>
                    <span className="stat-value">{calculatedProgress}%</span>
                </div>
            </div>

            {/* Прогресс-бар */}
            <div className="progress-bar-container">
                <div className={`progress-bar ${barColorClass}`} style={{ width: `${calculatedProgress}%` }}>
                    <span className="progress-text">{calculatedProgress}%</span>
                </div>
            </div>
        </div>
    );
}

export default ProgressHeader;