// src/App.tsx
import { MainLayout } from './components/layout/MainLayout';

function App() {
  return (
    <MainLayout>
      {/* Your main content will go here */}
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Battlefield Overview</h1>
        {/* Map and other components will be added here */}
      </div>
    </MainLayout>
  );
}

export default App;