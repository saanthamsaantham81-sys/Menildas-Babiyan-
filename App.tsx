import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import TradeLog from './components/TradeLog';
import Calculators from './components/Calculators';
import AIAnalysis from './components/AIAnalysis';
import { Trade, AccountState } from './types';
import { LayoutDashboard, BookOpen, Calculator, Brain, Settings, Wallet } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<'dashboard' | 'journal' | 'calculators' | 'ai'>('dashboard');
  
  // State for Account and Trades
  const [account, setAccount] = useState<AccountState>({
    initialBalance: 10000,
    currentBalance: 10000
  });

  const [trades, setTrades] = useState<Trade[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedTrades = localStorage.getItem('decoders_trades');
    const savedAccount = localStorage.getItem('decoders_account');
    
    if (savedTrades) setTrades(JSON.parse(savedTrades));
    if (savedAccount) setAccount(JSON.parse(savedAccount));
  }, []);

  // Save to localStorage on changes
  useEffect(() => {
    localStorage.setItem('decoders_trades', JSON.stringify(trades));
    localStorage.setItem('decoders_account', JSON.stringify(account));
  }, [trades, account]);

  // Update Balance when trades change
  useEffect(() => {
    const totalPnL = trades.reduce((acc, trade) => acc + (trade.pnl || 0), 0);
    setAccount(prev => ({
      ...prev,
      currentBalance: prev.initialBalance + totalPnL
    }));
  }, [trades, account.initialBalance]);

  const addTrade = (newTrade: Omit<Trade, 'id'>) => {
    const trade: Trade = { ...newTrade, id: Date.now().toString() };
    setTrades([...trades, trade]);
  };

  const deleteTrade = (id: string) => {
    setTrades(trades.filter(t => t.id !== id));
  };

  const handleInitialBalanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newInit = Number(e.target.value);
    setAccount(prev => ({
      ...prev,
      initialBalance: newInit
    }));
  };

  return (
    <div className="min-h-screen flex bg-decoder-navy text-decoder-cream font-sans">
      
      {/* Sidebar */}
      <aside className="w-64 bg-decoder-dark border-r border-decoder-blue/20 flex-shrink-0 fixed h-full z-10 hidden md:flex md:flex-col">
        <div className="p-6 border-b border-decoder-blue/10">
          <h1 className="text-2xl font-extrabold tracking-tight text-decoder-cream">
            CHART <span className="text-decoder-blue block text-lg font-normal">DECODERS</span>
          </h1>
          <p className="text-xs text-gray-500 mt-2 tracking-widest">MARKET MAKER'S MINDSET</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <SidebarItem icon={<LayoutDashboard />} label="Dashboard" active={view === 'dashboard'} onClick={() => setView('dashboard')} />
          <SidebarItem icon={<BookOpen />} label="Trade Journal" active={view === 'journal'} onClick={() => setView('journal')} />
          <SidebarItem icon={<Calculator />} label="Calculators" active={view === 'calculators'} onClick={() => setView('calculators')} />
          <SidebarItem icon={<Brain />} label="AI Mentor" active={view === 'ai'} onClick={() => setView('ai')} />
        </nav>

        <div className="p-6 border-t border-decoder-blue/10">
          <div className="flex items-center gap-3 text-gray-400 text-sm">
             <Settings size={16} /> <span>v1.0.0</span>
          </div>
        </div>
      </aside>

      {/* Mobile Nav (Bottom) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-decoder-dark border-t border-decoder-blue/20 z-50 flex justify-around p-3">
          <MobileNavItem icon={<LayoutDashboard />} active={view === 'dashboard'} onClick={() => setView('dashboard')} />
          <MobileNavItem icon={<BookOpen />} active={view === 'journal'} onClick={() => setView('journal')} />
          <MobileNavItem icon={<Calculator />} active={view === 'calculators'} onClick={() => setView('calculators')} />
          <MobileNavItem icon={<Brain />} active={view === 'ai'} onClick={() => setView('ai')} />
      </div>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto pb-20 md:pb-8">
        
        {/* Header / Settings Strip */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
             <h2 className="text-3xl font-bold">{view.charAt(0).toUpperCase() + view.slice(1)}</h2>
             <p className="text-gray-400 text-sm">Welcome back, Decoder.</p>
          </div>

          {/* Simple Config for Initial Balance */}
          <div className="bg-decoder-card px-4 py-2 rounded-lg border border-decoder-blue/20 flex items-center gap-3">
            <Wallet className="text-decoder-blue" size={18} />
            <div className="flex flex-col">
              <label className="text-[10px] text-gray-500 uppercase font-bold">Starting Balance</label>
              <div className="flex items-center">
                <span className="text-gray-400 mr-1">$</span>
                <input 
                  type="number" 
                  value={account.initialBalance} 
                  onChange={handleInitialBalanceChange}
                  className="bg-transparent w-24 font-bold text-decoder-cream outline-none focus:border-b focus:border-decoder-blue"
                />
              </div>
            </div>
          </div>
        </div>

        {/* View Content */}
        <div className="animate-fade-in">
          {view === 'dashboard' && <Dashboard trades={trades} account={account} />}
          {view === 'journal' && <TradeLog trades={trades} onAddTrade={addTrade} onDeleteTrade={deleteTrade} />}
          {view === 'calculators' && <Calculators />}
          {view === 'ai' && <AIAnalysis trades={trades} balance={account.currentBalance} />}
        </div>
      </main>
    </div>
  );
};

const SidebarItem = ({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
      active 
      ? 'bg-decoder-blue text-white shadow-lg shadow-decoder-blue/20' 
      : 'text-gray-400 hover:bg-decoder-card hover:text-decoder-cream'
    }`}
  >
    {icon}
    <span className="font-medium">{label}</span>
  </button>
);

const MobileNavItem = ({ icon, active, onClick }: { icon: React.ReactNode, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`p-3 rounded-full ${active ? 'bg-decoder-blue text-white' : 'text-gray-400'}`}
  >
    {icon}
  </button>
);

export default App;
