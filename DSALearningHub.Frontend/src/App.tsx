import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Learn from './pages/Learn';
import Visualizer from './pages/Visualizer';

function App() {
  return (
    <BrowserRouter>
      <div className="flex bg-gray-50 min-h-screen font-sans">
        <Sidebar />
        <main className="flex-1 h-screen overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/visualizer" element={<Visualizer />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
