// pages/Statistics.jsx
import { useState, useEffect } from 'react';
import './Statistics.css'; // Создайте этот файл для стилей, если нужно

function Statistics() {
    const [technologies, setTechnologies] = useState([]);
    const [stats, setStats] = useState({ total: 0, completed: 0, inProgress: 0, notStarted: 0, progress: 0 });

    useEffect(() => {
        const saved = localStorage.getItem('technologies');
        if (saved) {
            const techs = JSON.parse(saved);
            setTechnologies(techs);

            const total = techs.length;
            const completed = techs.filter(t => t.status === 'completed').length;
            const inProgress = techs.filter(t => t.status === 'in-progress').length;
            const notStarted = techs.filter(t => t.status === 'not-started').length;
            const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

            setStats({ total, completed, inProgress, notStarted, progress });
        }
    }, []);

    // Генерация данных для круговой диаграммы (упрощённо)
    const generateChartData = () => {
        const { completed, inProgress, notStarted } = stats;
        const total = stats.total;

        if (total === 0) return [];

        const completedPercentage = (completed / total) * 100;
        const inProgressPercentage = (inProgress / total) * 100;
        const notStartedPercentage = (notStarted / total) * 100;

        return [
            { status: 'completed', percentage: completedPercentage, color: '#6a4c93' },
            { status: 'in-progress', percentage: inProgressPercentage, color: '#a855f7' },
            { status: 'not-started', percentage: notStartedPercentage, color: '#9ca3af' },
        ];
    };

    const chartData = generateChartData();

    return (
        <div className="page">
            <div className="page-header">
                <h1>Статистика изучения</h1>
                <p>Анализ прогресса в освоении технологий</p>
            </div>

            <div className="stats-overview">
                <div className="stat-card">
                    <h3>Всего технологий</h3>
                    <p className="stat-number">{stats.total}</p>
                </div>
                <div className="stat-card">
                    <h3>Изучено</h3>
                    <p className="stat-number stat-completed">{stats.completed}</p>
                </div>
                <div className="stat-card">
                    <h3>В процессе</h3>
                    <p className="stat-number stat-in-progress">{stats.inProgress}</p>
                </div>
                <div className="stat-card">
                    <h3>Не начато</h3>
                    <p className="stat-number stat-not-started">{stats.notStarted}</p>
                </div>
            </div>

            <div className="progress-summary">
                <h2>Общий прогресс: {stats.progress}%</h2>
                <div className="progress-bar-container">
                    <div 
                        className="progress-bar" 
                        style={{ 
                            width: `${stats.progress}%`,
                            backgroundColor: stats.progress === 100 ? '#6a4c93' : stats.progress >= 50 ? '#a855f7' : '#9ca3af'
                        }}
                    >
                        {stats.progress > 10 && `${stats.progress}%`}
                    </div>
                </div>
            </div>

            <div className="chart-section">
                <h2>Распределение по статусам</h2>
                <div className="pie-chart">
                    {chartData.length > 0 ? (
                        <svg viewBox="0 0 100 100" className="chart-svg">
                            {chartData.map((segment, index) => {
                                if (segment.percentage === 0) return null;

                                // Рассчитываем длину дуги
                                const radius = 40;
                                const circumference = 2 * Math.PI * radius;
                                const strokeDasharray = (segment.percentage / 100) * circumference;
                                const strokeDashoffset = index > 0 
                                    ? chartData.slice(0, index).reduce((acc, seg) => acc + (seg.percentage / 100) * circumference, 0) 
                                    : 0;

                                return (
                                    <circle
                                        key={segment.status}
                                        cx="50"
                                        cy="50"
                                        r={radius}
                                        fill="transparent"
                                        stroke={segment.color}
                                        strokeWidth="15"
                                        strokeDasharray={`${strokeDasharray} ${circumference}`}
                                        strokeDashoffset={`-${strokeDashoffset}`}
                                        transform="rotate(-90 50 50)" // Поворачиваем, чтобы начать сверху
                                    />
                                );
                            })}
                        </svg>
                    ) : (
                        <p>Нет данных для отображения</p>
                    )}
                    <div className="chart-legend">
                        {chartData.map(segment => (
                            <div key={segment.status} className="legend-item">
                                <span 
                                    className="legend-color" 
                                    style={{ backgroundColor: segment.color }}
                                ></span>
                                <span>{segment.status === 'completed' ? 'Изучено' : segment.status === 'in-progress' ? 'В процессе' : 'Не начато'}: {segment.percentage.toFixed(1)}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="recent-activity">
                <h2>Недавняя активность</h2>
                <ul>
                    {technologies
                        .filter(t => t.status === 'completed')
                        .sort((a, b) => b.id - a.id) // Просто сортируем по ID, так как у нас нет даты
                        .slice(0, 3)
                        .map(tech => (
                            <li key={tech.id}>{tech.title} - завершено</li>
                        ))}
                    {technologies
                        .filter(t => t.status === 'in-progress')
                        .sort((a, b) => b.id - a.id)
                        .slice(0, 3)
                        .map(tech => (
                            <li key={tech.id}>{tech.title} - в процессе изучения</li>
                        ))}
                </ul>
                {technologies.filter(t => t.status === 'completed' || t.status === 'in-progress').length === 0 && (
                    <p>Нет активности.</p>
                )}
            </div>
        </div>
    );
}

export default Statistics;