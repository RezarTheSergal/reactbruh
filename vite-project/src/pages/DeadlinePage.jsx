import { useState } from 'react';
import DeadlineForm from '../components/DeadlineForm';
import useTechnologies from '../useTechnologies';
import { useNotification } from '../components/NotificationContext';

function DeadlinePage() {
  const { technologies } = useTechnologies();
  const { showSuccess, showError } = useNotification();
  const [deadlines, setDeadlines] = useState([]);

  const handleSave = (data) => {
    // Здесь логика сохранения дедлайнов
    const newDeadline = {
      ...data,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    
    setDeadlines(prev => [...prev, newDeadline]);
    showSuccess(`Дедлайн для "${data.technologyName}" установлен!`);
    
    // Можно вернуться назад или очистить форму
    setTimeout(() => {
      window.history.back();
    }, 1500);
  };

  const handleCancel = () => {
    window.history.back();
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Установка сроков изучения</h1>
        <p>Планируйте время для изучения технологий</p>
      </div>
      
      <div className="page-content">
        <DeadlineForm 
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
      
      {deadlines.length > 0 && (
        <div className="deadlines-list">
          <h3>Установленные дедлайны</h3>
          <ul>
            {deadlines.map(deadline => (
              <li key={deadline.id}>
                <strong>{deadline.technologyName}</strong>: 
                с {deadline.startDate} по {deadline.endDate} 
                ({deadline.hoursPerWeek} ч/нед)
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default DeadlinePage;