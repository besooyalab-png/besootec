
import React, { useState } from 'react';
import { User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, currentPage, setCurrentPage }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!user) return <>{children}</>;

  const navItems = [
    { id: 'dashboard', icon: 'fa-chart-pie', label: 'Dashboard' },
    { id: 'deploy', icon: 'fa-cloud-arrow-up', label: 'Deploy Bot' },
    { id: 'settings', icon: 'fa-gears', label: 'Settings' },
  ];

  const NavContent = () => (
    <>
      <div className="p-6">
        <div className="flex items-center gap-3 text-indigo-400 font-bold text-xl">
          <i className="fa-solid fa-robot"></i>
          <span>Besoo host</span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => {
              setCurrentPage(item.id);
              setIsSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              currentPage === item.id 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                : 'text-slate-400 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <i className={`fa-solid ${item.icon} w-5`}></i>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center gap-3 p-2 bg-slate-900/50 rounded-xl mb-4">
          <img src={user.photoURL} alt={user.displayName} className="w-10 h-10 rounded-full border border-indigo-500/50" />
          <div className="overflow-hidden">
            <p className="text-sm font-semibold truncate">{user.displayName}</p>
            <p className="text-xs text-slate-500 truncate">{user.isPremium ? '💎 Premium' : '🌱 Free Plan'}</p>
          </div>
        </div>
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
        >
          <i className="fa-solid fa-right-from-bracket w-5"></i>
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-slate-900">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Desktop & Tablet Drawer */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-800 border-r border-slate-700 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:block
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <NavContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 w-full overflow-x-hidden">
        <header className="h-16 bg-slate-800/80 backdrop-blur-md border-b border-slate-700 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-400 hover:text-white"
            >
              <i className="fa-solid fa-bars-staggered text-xl"></i>
            </button>
            <h2 className="text-lg font-semibold capitalize hidden sm:block">{currentPage}</h2>
            {/* Logo for mobile only */}
            <div className="flex items-center gap-2 text-indigo-400 font-bold sm:hidden">
              <i className="fa-solid fa-robot"></i>
              <span>Besoo host</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-slate-400 hover:text-white transition-colors relative p-2">
               <i className="fa-solid fa-bell"></i>
               <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full border-2 border-slate-800"></span>
            </button>
            <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full border border-slate-600 lg:hidden" />
          </div>
        </header>
        
        <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
