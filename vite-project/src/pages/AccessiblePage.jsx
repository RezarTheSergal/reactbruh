import WorkingAccessibleForm from '../components/WorkingAccessibleForm';

function AccessibleFormPage() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Доступная контактная форма</h1>
        <p>Пример формы с полной доступностью для скринридеров</p>
      </div>
      
      <div className="page-content">
        <WorkingAccessibleForm />
      </div>
    </div>
  );
}

export default AccessibleFormPage;