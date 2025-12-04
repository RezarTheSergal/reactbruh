import { useState } from 'react';
import TechnologyForm from '../components/TechnologyForm';
import useTechnologies from '../useTechnologies';
import { useNotification } from '../components/NotificationContext';

function TechnologyFormPage() {
  const { technologies } = useTechnologies();
  const { showSuccess } = useNotification();
  const [techList, setTechList] = useState(technologies);

  const handleSave = (formData) => {
    const newTech = {
      ...formData,
      id: Date.now(),
      status: 'not-started',
      notes: ''
    };
    
    setTechList(prev => [...prev, newTech]);
    showSuccess(`Технология "${formData.title}" добавлена!`);
    
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
        <h1>Добавление новой технологии</h1>
        <p>Заполните информацию о технологии для изучения</p>
      </div>
      
      <div className="page-content">
        <TechnologyForm 
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}

export default TechnologyFormPage;