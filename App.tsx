
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import { User } from './types';
import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';
import UploadScreen from './screens/UploadScreen';
import LogsScreen from './screens/LogsScreen';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<string>('dashboard');
  const [selectedBotId, setSelectedBotId] = useState<string | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('besoo_user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleLogin = (u: User) => {
    setUser(u);
    localStorage.setItem('besoo_user', JSON.stringify(u));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('besoo_user');
  };

  const renderContent = () => {
    if (!user) return <LoginScreen onLogin={handleLogin} />;

    switch (currentPage) {
      case 'dashboard':
        return <DashboardScreen user={user} onAddBot={() => setCurrentPage('deploy')} onShowLogs={id => { setSelectedBotId(id); setCurrentPage('logs'); }} />;
      case 'deploy':
        return <UploadScreen user={user} onSuccess={() => setCurrentPage('dashboard')} />;
      case 'logs':
        return selectedBotId ? <LogsScreen botId={selectedBotId} onBack={() => setCurrentPage('dashboard')} /> : null;
      default:
        return null;
    }
  };

  return (
    <Layout user={user} onLogout={handleLogout} currentPage={currentPage} setCurrentPage={setCurrentPage}>
      {renderContent()}
    </Layout>
  );
};

export default App;
