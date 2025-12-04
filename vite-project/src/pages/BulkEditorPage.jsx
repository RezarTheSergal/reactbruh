import { useState } from 'react';
import BulkStatusEditor from '../components/BulkStatusEditor';
import useTechnologies from '../useTechnologies';
import { useNotification } from '../components/NotificationContext';

function BulkEditorPage() {
  const { technologies, updateStatus } = useTechnologies();
  const { showSuccess } = useNotification();
  const [localTechs, setLocalTechs] = useState(technologies);

  const handleUpdate = (updatedTechs) => {
    // Обновляем статусы в хранилище
    updatedTechs.forEach(tech => {
      if (tech.status !== technologies.find(t => t.id === tech.id)?.status) {
        updateStatus(tech.id, tech.status);
      }
    });
    
    setLocalTechs(updatedTechs);
    showSuccess(`Обновлено ${updatedTechs.length} технологий`);
  };

  const handleCancel = () => {
    window.history.back();
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Массовое редактирование статусов</h1>
        <p>Выберите технологии и установите для них новый статус</p>
      </div>
      
      <div className="page-content">
        <BulkStatusEditor 
          technologies={localTechs}
          onUpdate={handleUpdate}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}

export default BulkEditorPage;