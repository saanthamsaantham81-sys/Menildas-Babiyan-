import React, { useState } from 'react';

const Calculators: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pips' | 'options'>('pips');

  return (
    <div className="max-w-4xl mx-auto bg-decoder-card rounded-xl border border-decoder-blue/20 shadow-lg overflow-hidden">
      <div className="flex border-b border-decoder-blue/20">
        <button
          onClick={() => setActiveTab('pips')}
          className={`flex-1 py-4 text-center font-semibold transition-colors ${
            activeTab === 'pips' 
              ? 'bg-decoder-blue/20 text-decoder-blue border-b-2 border-decoder-blue' 
              : 'text-gray-400 hover:text-decoder-cream'
          }`}
        >
          Pips Calculator (Forex)
        </button>
        <button
          onClick={() => setActiveTab('options')}
          className={`flex-1 py-4 text-center font-semibold transition-colors ${
            activeTab === 'options' 
              ? 'bg-decoder-blue/20 text-decoder-blue border-b-2 border-decoder-blue' 
              : 'text-gray-400 hover:text-decoder-cream'
          }`}
        >
          Options Profit/Loss
        </button>
      </div>

      <div className="p-8">
        {activeTab === 'pips' ? <PipsCalculator /> : <OptionsCalculator />}
      </div>
    </div>
  );
};

const PipsCalculator: React.FC = () => {
  const [pair, setPair] = useState('EURUSD');
  const [entry, setEntry] = useState<number | ''>('');
  const [exit, setExit] = useState<number | ''>('');
  const [lotSize, setLotSize] = useState<number | ''>(1);
  
  const calculatePips = () => {
    if (entry === '' || exit === '') return { pips: 0, profit: 0 };
    
    const isJpy = pair.includes('JPY');
    const multiplier = isJpy ? 100 : 10000;
    const pips = (Number(exit) - Number(entry)) * multiplier;
    
    // Standard Lot = $10 per pip on EURUSD (approx)
    // Simple approximation for demo
    const profit = pips * Number(lotSize) * (isJpy ? 9 : 10); 

    return { pips, profit };
  };

  const result = calculatePips();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm text-gray-400 mb-2">Currency Pair</label>
          <select 
            className="w-full bg-decoder-dark border border-gray-700 rounded-lg p-3 text-decoder-cream focus:ring-2 focus:ring-decoder-blue"
            value={pair}
            onChange={(e) => setPair(e.target.value)}
          >
            <option value="EURUSD">EUR/USD</option>
            <option value="GBPUSD">GBP/USD</option>
            <option value="USDJPY">USD/JPY</option>
            <option value="XAUUSD">XAU/USD (Gold)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-2">Lot Size</label>
          <input 
            type="number" 
            className="w-full bg-decoder-dark border border-gray-700 rounded-lg p-3 text-decoder-cream focus:ring-2 focus:ring-decoder-blue"
            value={lotSize}
            onChange={(e) => setLotSize(Number(e.target.value))}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-2">Entry Price</label>
          <input 
            type="number" 
            step="0.00001"
            className="w-full bg-decoder-dark border border-gray-700 rounded-lg p-3 text-decoder-cream focus:ring-2 focus:ring-decoder-blue"
            value={entry}
            onChange={(e) => setEntry(Number(e.target.value))}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-2">Exit Price</label>
          <input 
            type="number" 
            step="0.00001"
            className="w-full bg-decoder-dark border border-gray-700 rounded-lg p-3 text-decoder-cream focus:ring-2 focus:ring-decoder-blue"
            value={exit}
            onChange={(e) => setExit(Number(e.target.value))}
          />
        </div>
      </div>

      <div className="bg-decoder-dark p-6 rounded-xl border border-gray-800 mt-6">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-gray-500 text-sm uppercase tracking-wider">Pips Gained</p>
            <p className={`text-3xl font-bold mt-2 ${result.pips >= 0 ? 'text-emerald-400' : 'text-decoder-red'}`}>
              {result.pips.toFixed(1)}
            </p>
          </div>
          <div>
            <p className="text-gray-500 text-sm uppercase tracking-wider">Est. Profit (USD)</p>
            <p className={`text-3xl font-bold mt-2 ${result.profit >= 0 ? 'text-emerald-400' : 'text-decoder-red'}`}>
              ${result.profit.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const OptionsCalculator: React.FC = () => {
  const [type, setType] = useState<'Call' | 'Put'>('Call');
  const [contracts, setContracts] = useState<number>(1);
  const [premiumBuy, setPremiumBuy] = useState<number | ''>('');
  const [premiumSell, setPremiumSell] = useState<number | ''>('');

  const calculate = () => {
    if (premiumBuy === '' || premiumSell === '') return 0;
    // (Sell Premium - Buy Premium) * 100 * contracts
    return (Number(premiumSell) - Number(premiumBuy)) * 100 * contracts;
  };

  const profit = calculate();

  return (
    <div className="space-y-6">
       <div className="flex space-x-4 mb-4">
          <button 
            onClick={() => setType('Call')}
            className={`px-4 py-2 rounded-lg border ${type === 'Call' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'border-gray-700 text-gray-400'}`}
          >
            Call Option
          </button>
          <button 
             onClick={() => setType('Put')}
            className={`px-4 py-2 rounded-lg border ${type === 'Put' ? 'bg-decoder-red/20 border-decoder-red text-decoder-red' : 'border-gray-700 text-gray-400'}`}
          >
            Put Option
          </button>
       </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm text-gray-400 mb-2">Number of Contracts</label>
          <input 
            type="number" 
            className="w-full bg-decoder-dark border border-gray-700 rounded-lg p-3 text-decoder-cream focus:ring-2 focus:ring-decoder-blue"
            value={contracts}
            onChange={(e) => setContracts(Number(e.target.value))}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-2">Entry Premium ($)</label>
          <input 
            type="number" 
            step="0.01"
            className="w-full bg-decoder-dark border border-gray-700 rounded-lg p-3 text-decoder-cream focus:ring-2 focus:ring-decoder-blue"
            value={premiumBuy}
            onChange={(e) => setPremiumBuy(Number(e.target.value))}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-2">Exit Premium ($)</label>
          <input 
            type="number" 
            step="0.01"
            className="w-full bg-decoder-dark border border-gray-700 rounded-lg p-3 text-decoder-cream focus:ring-2 focus:ring-decoder-blue"
            value={premiumSell}
            onChange={(e) => setPremiumSell(Number(e.target.value))}
          />
        </div>
      </div>

      <div className="bg-decoder-dark p-6 rounded-xl border border-gray-800 mt-6 text-center">
         <p className="text-gray-500 text-sm uppercase tracking-wider">Total Profit / Loss</p>
          <p className={`text-4xl font-bold mt-2 ${profit >= 0 ? 'text-emerald-400' : 'text-decoder-red'}`}>
            {profit >= 0 ? '+' : ''}${profit.toLocaleString(undefined, {minimumFractionDigits: 2})}
          </p>
          <p className="text-xs text-gray-500 mt-2">*Calculated as (Exit - Entry) x 100 x Contracts</p>
      </div>
    </div>
  );
};

export default Calculators;
