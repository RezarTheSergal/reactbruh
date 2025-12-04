import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { NotificationProvider } from './components/NotificationContext';
import NotificationSnackbar from './components/NotificationSnackbar';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import TechnologyList from './pages/TechnologyList';
import TechnologyDetail from './pages/TechnologyDetail';
import AddTechnology from './pages/AddTechnology';
import Statistics from './pages/Statistics';
import Settings from './pages/Settings';
import TechnologyCard from './components/TechnologyCard';
import ProgressHeader from './components/ProgressHeader';
import QuickActions from './components/QuickActions';
import './components/SearchBox.css';
import useTechnologies from './useTechnologies';
import { useState, useCallback } from 'react';
import { useNotification } from './components/NotificationContext';

// Компонент с основной логикой приложения
function AppContent() {
  const { technologies, updateStatus, updateNotes, markAllCompleted, resetAllStatuses, progress } = useTechnologies();
  const { showSuccess, showError, showInfo, showWarning } = useNotification();

  // Состояние для активного фильтра
  const [activeFilter, setActiveFilter] = useState('all');
  // Состояние для поискового запроса
  const [searchQuery, setSearchQuery] = useState('');

  // Функция для сброса всех статусов с уведомлением
  const handleResetAll = () => {
    try {
      resetAllStatuses();
      showSuccess('Все статусы сброшены');
    } catch (error) {
      showError('Ошибка при сбросе статусов');
    }
  };

  // Функция для случайного выбора технологии с уведомлением
  const handleRandomSelect = () => {
    const notStarted = technologies.filter(tech => tech.status === 'not-started');
    if (notStarted.length > 0) {
      const randomTech = notStarted[Math.floor(Math.random() * notStarted.length)];
      updateStatus(randomTech.id, 'in-progress');
      showInfo(`Начато изучение: ${randomTech.title}`);
      return;
    }

    const inProgress = technologies.filter(tech => tech.status === 'in-progress');
    if (inProgress.length > 0) {
      const randomTech = inProgress[Math.floor(Math.random() * inProgress.length)];
      updateStatus(randomTech.id, 'completed');
      showSuccess(`Завершено изучение: ${randomTech.title}`);
      return;
    }

    showWarning('Нет доступных технологий для выбора');
  };

  // Функция для отметки всех как завершенных с уведомлением
  const handleMarkAllCompleted = () => {
    const notCompleted = technologies.filter(tech => tech.status !== 'completed');
    if (notCompleted.length === 0) {
      showInfo('Все технологии уже завершены');
      return;
    }

    try {
      markAllCompleted();
      showSuccess(`Отмечено как завершено: ${notCompleted.length} технологий`);
    } catch (error) {
      showError('Ошибка при обновлении статусов');
    }
  };

  // Функция изменения статуса с уведомлением
  const handleStatusChange = useCallback((techId) => {
    const tech = technologies.find(t => t.id === techId);
    if (!tech) {
      showError('Технология не найдена');
      return;
    }

    let newStatus;
    let message;

    if (tech.status === 'not-started') {
      newStatus = 'in-progress';
      message = `Начато изучение: ${tech.title}`;
    } else if (tech.status === 'in-progress') {
      newStatus = 'completed';
      message = `Завершено изучение: ${tech.title}`;
    } else {
      newStatus = 'not-started';
      message = `Статус сброшен: ${tech.title}`;
    }

    try {
      updateStatus(techId, newStatus);
      showInfo(message);
    } catch (error) {
      showError('Ошибка при обновлении статуса');
    }
  }, [technologies, updateStatus, showInfo, showError]);

  // Функция обновления заметок с уведомлением
  const handleNotesChange = useCallback((techId, notes) => {
    const tech = technologies.find(t => t.id === techId);
    try {
      updateNotes(techId, notes);
    } catch (error) {
      showError('Ошибка при сохранении заметок');
    }
  }, [technologies, updateNotes, showSuccess, showError]);

  // Рассчитываем статистику
  const total = technologies.length;
  const completed = technologies.filter(tech => tech.status === 'completed').length;

  // Фильтрация списка технологий
  const filteredTechnologies = technologies.filter(tech => {
    const matchesFilter = activeFilter === 'all' || tech.status === activeFilter;
    const matchesSearch =
      tech.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tech.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

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
                {/* Компонент заголовка с прогрессом */}
                <ProgressHeader total={total} completed={completed} progress={progress} />
                
                {/* Компонент быстрых действий */}
                <QuickActions
                  onMarkAllCompleted={handleMarkAllCompleted}
                  onResetAll={handleResetAll}
                  onRandomSelect={handleRandomSelect}
                  activeFilter={activeFilter}
                  onFilterChange={setActiveFilter}
                  technologies={technologies}
                />
                
                {/* Поле поиска */}
                <div className="search-box">
                  <input
                    type="text"
                    placeholder="Поиск технологий..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label="Поиск технологий"
                  />
                  <span>Найдено: {filteredTechnologies.length}</span>
                </div>
                
                {/* Список технологий */}
                <div className="technologies-list">
                  {filteredTechnologies.length === 0 ? (
                    <div className="no-results">
                      <p>Технологии не найдены. Попробуйте изменить фильтры или поисковый запрос.</p>
                    </div>
                  ) : (
                    filteredTechnologies.map((tech) => (
                      <TechnologyCard
                        key={tech.id}
                        techId={tech.id}
                        title={tech.title}
                        description={tech.description}
                        status={tech.status}
                        notes={tech.notes}
                        onStatusChange={() => handleStatusChange(tech.id)}
                        onNotesChange={handleNotesChange}
                      />
                    ))
                  )}
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
          
          <Route path="/bulk-editor" element={<BulkEditorPage />} />
          <Route path="/deadlines" element={<DeadlinePage />} />
          <Route path="/import-export" element={<ImportExportPage />} />
          <Route path="/accessible-form" element={<AccessibleFormPage />} />
          <Route path="/new-technology" element={<TechnologyFormPage />} />
        </Routes>
      </div>
    </Router>
  );
}

// Главный компонент приложения с провайдером уведомлений
function App() {
  return (
    <NotificationProvider>
      <AppContent />
      <NotificationSnackbar />
    </NotificationProvider>
  );
}

export default App;