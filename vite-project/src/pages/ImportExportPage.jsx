import DataImportExport from '../components/DataImportExport';

function ImportExportPage() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Импорт и экспорт данных</h1>
        <p>Работа с данными технологий в формате JSON</p>
      </div>
      
      <div className="page-content">
        <DataImportExport />
      </div>
    </div>
  );
}

export default ImportExportPage;