// App.js
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import TechnologyList from './pages/TechnologyList';
import TechnologyDetail from './pages/TechnologyDetail';
import AddTechnology from './pages/AddTechnology';
import Statistics from './pages/Statistics'; // Импортируем новую страницу
import Settings from './pages/Settings'; // Импортируем новую страницу
import TechnologyCard from './components/TechnologyCard';
import ProgressHeader from './components/ProgressHeader';
import QuickActions from './components/QuickActions';
import './components/SearchBox.css';
import useTechnologies from './useTechnologies';
import { useState, useCallback } from 'react';

function App() {
  const { technologies, updateStatus, updateNotes, markAllCompleted, resetAllStatuses, progress } = useTechnologies(); // Импортируем новые функции

  // Состояние для активного фильтра
  const [activeFilter, setActiveFilter] = useState('all');
  // Состояние для поискового запроса
  const [searchQuery, setSearchQuery] = useState('');

  // --- ИСПРАВЛЕННЫЕ функции для быстрых действий ---
  // const handleMarkAllCompleted = () => { // <-- УДАЛИТЬ ЭТУ ФУНКЦИЮ
  //   technologies.forEach(tech => {
  //     updateStatus(tech.id, 'completed');
  //   });
  // };

  const handleResetAll = () => {
    resetAllStatuses(); // Используем новую функцию
  };

  const handleRandomSelect = () => {
    const notStarted = technologies.filter(tech => tech.status === 'not-started');
    if (notStarted.length > 0) {
      const randomTech = notStarted[Math.floor(Math.random() * notStarted.length)];
      updateStatus(randomTech.id, 'in-progress');
      return;
    }

    const inProgress = technologies.filter(tech => tech.status === 'in-progress');
    if (inProgress.length > 0) {
      const randomTech = inProgress[Math.floor(Math.random() * inProgress.length)];
      updateStatus(randomTech.id, 'completed');
      return;
    }
  };

  // --- useCallback для onStatusChange ---
  const handleStatusChange = useCallback((techId) => {
    const tech = technologies.find(t => t.id === techId);
    if (!tech) return;

    let newStatus;
    if (tech.status === 'not-started') {
      newStatus = 'in-progress';
    } else if (tech.status === 'in-progress') {
      newStatus = 'completed';
    } else {
      newStatus = 'not-started';
    }
    updateStatus(techId, newStatus);
  }, [technologies, updateStatus]);

  // --- Конец исправленных функций ---

  // Рассчитываем статистику
  const total = technologies.length;
  const completed = technologies.filter(tech => tech.status === 'completed').length;

  // --- Фильтрация списка технологий ---
  // Сначала применяем фильтр по статусу, затем по поисковому запросу
  const filteredTechnologies = technologies.filter(tech => {
    const matchesFilter = activeFilter === 'all' || tech.status === activeFilter;
    const matchesSearch =
      tech.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tech.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });
  // --- Конец фильтрации ---

  return (
    <Router>
      <div className="app">
        <Navigation />
        <Routes>
          {/* Главная страница с отфильтрованным списком технологий */}
          <Route path="/" element={
            <>
              <header className="app-header">
                <h1>Дорожная карта изучения React</h1>
                <p>Отслеживайте прогресс в изучении технологий</p>
              </header>
              <main className="app-main">
                {/* Рендерим компонент ProgressHeader, передав ему статистику */}
                <ProgressHeader total={total} completed={completed} progress={progress} />
                {/* Рендерим компонент QuickActions, передав ему функции и состояние фильтра */}
                <QuickActions
                  onMarkAllCompleted={markAllCompleted} // <-- Передаем новую функцию
                  onResetAll={handleResetAll}
                  onRandomSelect={handleRandomSelect}
                  activeFilter={activeFilter}
                  onFilterChange={setActiveFilter} // Передаём сеттер состояния
                  technologies={technologies}
                />
                {/* Добавляем поле поиска */}
                <div className="search-box">
                  <input
                    type="text"
                    placeholder="Поиск технологий..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <span>Найдено: {filteredTechnologies.length}</span>
                </div>
                <div className="technologies-list">
                  {/* Рендерим отфильтрованный список */}
                  {filteredTechnologies.map((tech) => (
                    <TechnologyCard
                      key={tech.id}
                      techId={tech.id}
                      title={tech.title}
                      description={tech.description}
                      status={tech.status}
                      notes={tech.notes}
                      onStatusChange={() => handleStatusChange(tech.id)} // Передаем функцию
                      onNotesChange={updateNotes} // Передаем функцию обновления заметок
                    />
                  ))}
                </div>
              </main>
            </>
          } />
          {/* Страница со списком всех технологий */}
          <Route path="/technologies" element={<TechnologyList />} />
          {/* Страница добавления технологии */}
          <Route path="/add-technology" element={<AddTechnology />} />
          {/* Страница деталей конкретной технологии */}
          <Route path="/technology/:techId" element={<TechnologyDetail />} />
          {/* Страница статистики */}
          <Route path="/statistics" element={<Statistics />} />
          {/* Страница настроек */}
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;