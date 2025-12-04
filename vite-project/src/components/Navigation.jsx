// components/Navigation.jsx
import { Link, useLocation } from 'react-router-dom';
import './Navigation.css'; // Импортируем файл стилей для навигации

function Navigation() {
    const location = useLocation();

    return (
        <nav className="main-navigation">
            <div className="nav-brand">
                <Link to="/" className="nav-brand-link">
                    <h2>Трекер технологий</h2>
                </Link>
            </div>

            <ul className="nav-menu">
                <li>
                    <Link
                        to="/"
                        className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                    >
                        Главная
                    </Link>
                </li>
                <li>
                    <Link
                        to="/technologies"
                        className={`nav-link ${location.pathname === '/technologies' ? 'active' : ''}`}
                    >
                        Все технологии
                    </Link>
                </li>
                <li>
                    <Link
                        to="/new-technology"
                        className={`nav-link ${location.pathname === '/new-technology' ? 'active' : ''}`}
                    >
                        Добавить
                    </Link>
                </li>
                <li>
                    <Link
                        to="/bulk-editor"
                        className={`nav-link ${location.pathname === '/bulk-editor' ? 'active' : ''}`}
                    >
                        Массовое редактирование
                    </Link>
                </li>
                <li>
                    <Link
                        to="/deadlines"
                        className={`nav-link ${location.pathname === '/deadlines' ? 'active' : ''}`}
                    >
                        Дедлайны
                    </Link>
                </li>
                <li>
                    <Link
                        to="/import-export"
                        className={`nav-link ${location.pathname === '/import-export' ? 'active' : ''}`}
                    >
                        Импорт/Экспорт
                    </Link>
                </li>
                <li>
                    <Link
                        to="/accessible-form"
                        className={`nav-link ${location.pathname === '/accessible-form' ? 'active' : ''}`}
                    >
                        Контактная форма
                    </Link>
                </li>
                <li>
                    <Link
                        to="/statistics"
                        className={`nav-link ${location.pathname === '/statistics' ? 'active' : ''}`}
                    >
                        Статистика
                    </Link>
                </li>
                <li>
                    <Link
                        to="/settings"
                        className={`nav-link ${location.pathname === '/settings' ? 'active' : ''}`}
                    >
                        Настройки
                    </Link>
                </li>
            </ul>
        </nav>
    );
}

export default Navigation;