import React, { useState } from 'react';
import { Trade, AssetClass, TradeDirection, TradeStatus } from '../types';
import { Plus, Trash2, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface TradeLogProps {
  trades: Trade[];
  onAddTrade: (trade: Omit<Trade, 'id'>) => void;
  onDeleteTrade: (id: string) => void;
}

const TradeLog: React.FC<TradeLogProps> = ({ trades, onAddTrade, onDeleteTrade }) => {
  const [showForm, setShowForm] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    assetClass: AssetClass.FOREX,
    symbol: '',
    direction: TradeDirection.LONG,
    entryPrice: '',
    exitPrice: '',
    quantity: '',
    notes: '',
    status: TradeStatus.CLOSED
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calculatePnL = (entry: number, exit: number, qty: number, dir: TradeDirection, asset: AssetClass) => {
    // Basic logic: (Exit - Entry) * Qty for Long, (Entry - Exit) * Qty for Short
    // For Forex/Indices, usually needs a point multiplier, simplified here for general use
    // Assuming Qty is total units (not lots) for simplicity, or allowing user to override
    
    let rawDiff = dir === TradeDirection.LONG ? exit - entry : entry - exit;
    
    // Multiplier Adjustments for display logic
    let multiplier = 1;
    if (asset === AssetClass.FOREX) multiplier = 10000; // Pips visual
    
    // Actual PnL $ Value logic (User should usually input exact $ pnl or we estimate)
    // Here we will estimate PnL = difference * quantity. 
    // If Forex, user likely enters '1' for 1 Lot (100,000 units).
    
    if (asset === AssetClass.FOREX) {
        return rawDiff * Number(qty) * 100000; // Standard lot
    }
    if (asset === AssetClass.INDEX || asset === AssetClass.FUTURES) {
        return rawDiff * Number(qty); // $ per point usually
    }
    return rawDiff * Number(qty);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const entry = parseFloat(formData.entryPrice);
    const exit = parseFloat(formData.exitPrice) || entry; // If open, estimate 0 PnL or current
    const qty = parseFloat(formData.quantity);
    
    const pnl = formData.status === TradeStatus.CLOSED 
      ? calculatePnL(entry, exit, qty, formData.direction, formData.assetClass)
      : 0;

    onAddTrade({
      ...formData,
      entryPrice: entry,
      exitPrice: exit,
      quantity: qty,
      pnl: pnl,
    });
    setShowForm(false);
    // Reset form slightly but keep date/class
    setFormData(prev => ({ ...prev, symbol: '', entryPrice: '', exitPrice: '', quantity: '', notes: '' }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-decoder-cream">Trade Journal</h2>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-decoder-blue hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
        >
          <Plus size={18} /> New Trade
        </button>
      </div>

      {/* Form Modal/Panel */}
      {showForm && (
        <div className="bg-decoder-card border border-decoder-blue/20 p-6 rounded-xl animate-fade-in">
          <h3 className="text-lg font-semibold mb-4 text-decoder-cream">Log New Trade</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <input type="date" name="date" value={formData.date} onChange={handleInputChange} 
                   className="bg-decoder-dark border border-gray-700 rounded-lg p-2.5 text-decoder-cream focus:border-decoder-blue outline-none" required />
            
            <select name="assetClass" value={formData.assetClass} onChange={handleInputChange}
                    className="bg-decoder-dark border border-gray-700 rounded-lg p-2.5 text-decoder-cream focus:border-decoder-blue outline-none">
              {Object.values(AssetClass).map(ac => <option key={ac} value={ac}>{ac}</option>)}
            </select>

            <input type="text" name="symbol" placeholder="Symbol (e.g. EURUSD)" value={formData.symbol} onChange={handleInputChange}
                   className="bg-decoder-dark border border-gray-700 rounded-lg p-2.5 text-decoder-cream focus:border-decoder-blue outline-none uppercase" required />

            <select name="direction" value={formData.direction} onChange={handleInputChange}
                    className="bg-decoder-dark border border-gray-700 rounded-lg p-2.5 text-decoder-cream focus:border-decoder-blue outline-none">
              <option value={TradeDirection.LONG}>Long (Buy)</option>
              <option value={TradeDirection.SHORT}>Short (Sell)</option>
            </select>

            <input type="number" step="any" name="quantity" placeholder="Size (Lots/Contracts)" value={formData.quantity} onChange={handleInputChange}
                   className="bg-decoder-dark border border-gray-700 rounded-lg p-2.5 text-decoder-cream focus:border-decoder-blue outline-none" required />

            <input type="number" step="any" name="entryPrice" placeholder="Entry Price" value={formData.entryPrice} onChange={handleInputChange}
                   className="bg-decoder-dark border border-gray-700 rounded-lg p-2.5 text-decoder-cream focus:border-decoder-blue outline-none" required />

            <input type="number" step="any" name="exitPrice" placeholder="Exit Price (Optional if Open)" value={formData.exitPrice} onChange={handleInputChange}
                   className="bg-decoder-dark border border-gray-700 rounded-lg p-2.5 text-decoder-cream focus:border-decoder-blue outline-none" />

            <select name="status" value={formData.status} onChange={handleInputChange}
                    className="bg-decoder-dark border border-gray-700 rounded-lg p-2.5 text-decoder-cream focus:border-decoder-blue outline-none">
              <option value={TradeStatus.CLOSED}>Closed</option>
              <option value={TradeStatus.OPEN}>Open</option>
            </select>

            <textarea name="notes" placeholder="Notes / Analysis" value={formData.notes} onChange={handleInputChange}
                   className="md:col-span-4 bg-decoder-dark border border-gray-700 rounded-lg p-2.5 text-decoder-cream focus:border-decoder-blue outline-none h-20" />

            <div className="md:col-span-4 flex justify-end gap-3">
               <button type="button" onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white px-4 py-2">Cancel</button>
               <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-lg font-semibold">Save Trade</button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="bg-decoder-card border border-decoder-blue/20 rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-decoder-dark text-gray-400 uppercase text-xs font-semibold">
              <tr>
                <th className="p-4">Date</th>
                <th className="p-4">Asset</th>
                <th className="p-4">Symbol</th>
                <th className="p-4">Type</th>
                <th className="p-4">Entry</th>
                <th className="p-4">Exit</th>
                <th className="p-4 text-right">PnL</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {trades.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-500">No trades recorded yet. Start decoding the market!</td>
                </tr>
              ) : (
                trades.map(trade => (
                  <tr key={trade.id} className="hover:bg-decoder-blue/5 transition-colors">
                    <td className="p-4 text-decoder-cream">{trade.date}</td>
                    <td className="p-4 text-gray-300">{trade.assetClass}</td>
                    <td className="p-4 font-bold text-decoder-cream">{trade.symbol}</td>
                    <td className="p-4">
                      <span className={`flex items-center gap-1 ${trade.direction === TradeDirection.LONG ? 'text-emerald-400' : 'text-decoder-red'}`}>
                        {trade.direction === TradeDirection.LONG ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        {trade.direction}
                      </span>
                    </td>
                    <td className="p-4 text-gray-300">{trade.entryPrice}</td>
                    <td className="p-4 text-gray-300">{trade.exitPrice || '-'}</td>
                    <td className={`p-4 text-right font-bold ${trade.pnl > 0 ? 'text-emerald-400' : trade.pnl < 0 ? 'text-decoder-red' : 'text-gray-400'}`}>
                      {trade.pnl !== 0 ? `$${trade.pnl.toFixed(2)}` : '-'}
                    </td>
                    <td className="p-4 text-center">
                      <button onClick={() => onDeleteTrade(trade.id)} className="text-gray-500 hover:text-decoder-red transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TradeLog;
