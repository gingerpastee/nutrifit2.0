import React, { useState, useEffect } from 'react';
import { Auth } from './components/Auth';
import { Onboarding } from './components/Onboarding';
import { Dashboard } from './components/Dashboard';
import { Community } from './components/Community';
import { Partners } from './components/Partners';
import { AdminPanel } from './components/AdminPanel';
import { Button } from './components/Button';
import { storageService } from './services/storageService';
import { User, UserRole } from './types';
import { 
  LayoutDashboard, 
  Users, 
  Map, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  MessageCircleQuestion
} from 'lucide-react';
import { geminiService } from './services/geminiService';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<'dashboard' | 'community' | 'partners' | 'admin'>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [adviceQuery, setAdviceQuery] = useState('');
  const [adviceResult, setAdviceResult] = useState('');
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  useEffect(() => {
    const stored = storageService.getCurrentUser();
    if (stored) setUser(stored);
  }, []);

  const handleLogout = () => {
    storageService.logout();
    setUser(null);
    setCurrentView('dashboard');
  };

  const askAdvice = async () => {
    if (!adviceQuery.trim()) return;
    setLoadingAdvice(true);
    setAdviceResult('');
    try {
      const res = await geminiService.getFitnessAdvice(adviceQuery);
      setAdviceResult(res);
    } catch (e) {
      setAdviceResult("Sorry, I'm taking a water break. Try again later.");
    } finally {
      setLoadingAdvice(false);
    }
  };

  // 1. Auth Check
  if (!user) {
    return <Auth onLogin={setUser} />;
  }

  // 2. Onboarding Check (skip for admin)
  if (user.role !== UserRole.ADMIN && !user.profile) {
    return <Onboarding user={user} onComplete={setUser} />;
  }

  // 3. Main App Layout
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}

      {/* Sidebar Navigation */}
      <aside className={`fixed md:sticky top-0 h-screen w-64 bg-white border-r border-gray-200 z-30 transition-transform transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="p-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-brand-600 flex items-center gap-2">
            NutriFit
          </h1>
          <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <nav className="px-4 space-y-2 mt-4">
          <NavButton 
            active={currentView === 'dashboard'} 
            onClick={() => { setCurrentView('dashboard'); setIsMobileMenuOpen(false); }} 
            icon={<LayoutDashboard size={20} />} 
            label="Dashboard" 
          />
          <NavButton 
            active={currentView === 'community'} 
            onClick={() => { setCurrentView('community'); setIsMobileMenuOpen(false); }} 
            icon={<Users size={20} />} 
            label="Community" 
          />
          <NavButton 
            active={currentView === 'partners'} 
            onClick={() => { setCurrentView('partners'); setIsMobileMenuOpen(false); }} 
            icon={<Map size={20} />} 
            label="Find Partners" 
          />
          
          {user.role === UserRole.ADMIN && (
             <NavButton 
               active={currentView === 'admin'} 
               onClick={() => { setCurrentView('admin'); setIsMobileMenuOpen(false); }} 
               icon={<Settings size={20} />} 
               label="Admin Panel" 
             />
          )}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t bg-gray-50">
           <div className="flex items-center space-x-3 mb-4">
             <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold">
               {user.name.charAt(0)}
             </div>
             <div className="overflow-hidden">
               <p className="font-medium text-sm text-gray-900 truncate">{user.name}</p>
               <p className="text-xs text-gray-500 truncate">{user.email}</p>
             </div>
           </div>
           <Button variant="outline" size="sm" className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200" onClick={handleLogout}>
             <LogOut size={16} className="mr-2" /> Sign Out
           </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 overflow-y-auto h-screen">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b p-4 flex items-center justify-between sticky top-0 z-10">
           <span className="font-bold text-lg text-brand-600">NutriFit</span>
           <button onClick={() => setIsMobileMenuOpen(true)}>
             <Menu className="w-6 h-6 text-gray-600" />
           </button>
        </header>

        <div className="p-6 md:p-10 max-w-7xl mx-auto pb-32">
          {currentView === 'dashboard' && <Dashboard user={user} onUpdateUser={setUser} />}
          {currentView === 'community' && <Community currentUser={user} />}
          {currentView === 'partners' && <Partners currentUser={user} />}
          {currentView === 'admin' && user.role === UserRole.ADMIN && <AdminPanel />}
        </div>
        
        {/* Quick Advice Widget (Floating) */}
        {currentView !== 'admin' && (
          <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end pointer-events-none">
             <div className="bg-white shadow-xl rounded-2xl p-4 w-80 mb-4 border border-brand-100 pointer-events-auto transform transition-all origin-bottom-right">
                <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <MessageCircleQuestion className="w-4 h-4 text-brand-500" /> Ask AI Coach
                </h4>
                {adviceResult && (
                  <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700 mb-3 max-h-40 overflow-y-auto">
                    {adviceResult}
                  </div>
                )}
                <div className="flex gap-2">
                  <input 
                    className="flex-1 text-sm border rounded px-2 py-1 focus:ring-1 focus:ring-brand-500 outline-none"
                    placeholder="E.g. How to lose belly fat?"
                    value={adviceQuery}
                    onChange={(e) => setAdviceQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && askAdvice()}
                  />
                  <button 
                    onClick={askAdvice} 
                    disabled={loadingAdvice}
                    className="bg-brand-600 text-white rounded p-1.5 hover:bg-brand-700 disabled:opacity-50"
                  >
                    {loadingAdvice ? <div className="animate-spin w-4 h-4 border-2 border-white rounded-full border-t-transparent"></div> : <SendIcon />}
                  </button>
                </div>
             </div>
          </div>
        )}
      </main>
    </div>
  );
}

const SendIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
);

const NavButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-medium ${active ? 'bg-brand-50 text-brand-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
  >
    <span className={active ? 'text-brand-600' : 'text-gray-400'}>{icon}</span>
    <span>{label}</span>
  </button>
);
