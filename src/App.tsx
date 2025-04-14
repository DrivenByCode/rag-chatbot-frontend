import { Route, Routes } from 'react-router-dom';
import ChatBotPage from '@/pages/ChatBotPage';
import AdminPage from '@/pages/AdminPage';
import Header from '@/components/Header';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/chat" element={<ChatBotPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<ChatBotPage />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
