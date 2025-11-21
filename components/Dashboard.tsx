import React, { useMemo } from 'react';
import { Trade, AccountState } from '../types';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';

interface DashboardProps {
  trades: Trade[];
  account: AccountState;
}

const Dashboard: React.FC<DashboardProps> = ({ trades, account }) => {
  
  const stats = useMemo(() => {
    const closedTrades = trades.filter(t => t.status === 'Closed');
    const totalTrades = closedTrades.length;
    const wins = closedTrades.filter(t => t.pnl > 0).length;
    const losses = closedTrades.filter(t => t.pnl <= 0).length;
    const winRate = totalTrades > 0 ? (wins / totalTrades) * 100 : 0;
    const totalPnL = closedTrades.reduce((acc, t) => acc + t.pnl, 0);
    const profitFactor = losses === 0 ? wins : (closedTrades.filter(t => t.pnl > 0).reduce((a,b)=>a+b.pnl,0) / Math.abs(closedTrades.filter(t => t.pnl < 0).reduce((a,b)=>a+b.pnl,0)));

    return { totalTrades, wins, losses, winRate, totalPnL, profitFactor };
  }, [trades]);

  const chartData = useMemo(() => {
    let runningBalance = account.initialBalance;
    const data = [{ name: 'Start', balance: runningBalance, pnl: 0 }];
    
    // Sort by date
    const sortedTrades = [...trades]
      .filter(t => t.status === 'Closed')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    sortedTrades.forEach((trade, index) => {
      runningBalance += trade.pnl;
      data.push({
        name: `T${index + 1}`,
        balance: runningBalance,
        pnl: trade.pnl
      });
    });
    return data;
  }, [trades, account.initialBalance]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-decoder-card p-6 rounded-xl border border-decoder-blue/20 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-decoder-blue text-sm font-medium">Current Balance</p>
              <h3 className="text-2xl font-bold text-decoder-cream mt-1">
                ${account.currentBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </h3>
            </div>
            <div className="p-3 bg-decoder-blue/20 rounded-full">
              <DollarSign className="text-decoder-blue w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-decoder-card p-6 rounded-xl border border-decoder-blue/20 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-400 text-sm font-medium">Total PnL</p>
              <h3 className={`text-2xl font-bold mt-1 ${stats.totalPnL >= 0 ? 'text-emerald-400' : 'text-decoder-red'}`}>
                {stats.totalPnL >= 0 ? '+' : ''}{stats.totalPnL.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </h3>
            </div>
            <div className={`p-3 rounded-full ${stats.totalPnL >= 0 ? 'bg-emerald-500/20' : 'bg-decoder-red/20'}`}>
              {stats.totalPnL >= 0 ? <TrendingUp className="text-emerald-400 w-6 h-6" /> : <TrendingDown className="text-decoder-red w-6 h-6" />}
            </div>
          </div>
        </div>

        <div className="bg-decoder-card p-6 rounded-xl border border-decoder-blue/20 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-400 text-sm font-medium">Win Rate</p>
              <h3 className="text-2xl font-bold text-decoder-cream mt-1">
                {stats.winRate.toFixed(1)}%
              </h3>
            </div>
            <div className="p-3 bg-purple-500/20 rounded-full">
              <Activity className="text-purple-400 w-6 h-6" />
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-400">
            {stats.wins}W - {stats.losses}L
          </div>
        </div>

        <div className="bg-decoder-card p-6 rounded-xl border border-decoder-blue/20 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-400 text-sm font-medium">Profit Factor</p>
              <h3 className="text-2xl font-bold text-decoder-cream mt-1">
                {isFinite(stats.profitFactor) ? stats.profitFactor.toFixed(2) : '∞'}
              </h3>
            </div>
            <div className="p-3 bg-orange-500/20 rounded-full">
              <Activity className="text-orange-400 w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Balance Curve */}
        <div className="lg:col-span-2 bg-decoder-card p-6 rounded-xl border border-decoder-blue/20 shadow-lg">
          <h3 className="text-lg font-semibold text-decoder-cream mb-6">Account Growth</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3D9A46" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3D9A46" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="name" stroke="#64748B" />
                <YAxis stroke="#64748B" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0B1221', borderColor: '#1E6091', color: '#FAEBD7' }}
                  itemStyle={{ color: '#FAEBD7' }}
                />
                <Area type="monotone" dataKey="balance" stroke="#3D9A46" fillOpacity={1} fill="url(#colorBalance)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent PnL Sticks */}
        <div className="bg-decoder-card p-6 rounded-xl border border-decoder-blue/20 shadow-lg">
          <h3 className="text-lg font-semibold text-decoder-cream mb-6">PnL Distribution</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData.slice(1)}> {/* Skip initial start point */}
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="name" stroke="#64748B" hide />
                <YAxis stroke="#64748B" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0B1221', borderColor: '#1E6091' }}
                />
                <Line type="step" dataKey="pnl" stroke="#1E6091" strokeWidth={2} dot={{ r: 4, fill: '#FAEBD7' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
