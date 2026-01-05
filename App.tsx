
import React, { useState, useEffect, useMemo } from 'react';
import { Plus, FolderOpen, ChevronLeft, Trash2, Edit2, X, Check } from 'lucide-react';
import { Expense, ViewType } from './types';
import { INITIAL_EXPENSES, STORAGE_KEY } from './constants';

const App: React.FC = () => {
  const [view, setView] = useState<ViewType>('dashboard');
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    item: '',
    amount: '',
    note: ''
  });

  // Initialize data from localStorage or fallback to constants
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setExpenses(JSON.parse(saved));
      } catch (e) {
        setExpenses(INITIAL_EXPENSES);
      }
    } else {
      setExpenses(INITIAL_EXPENSES);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_EXPENSES));
    }
  }, []);

  // Persist expenses whenever state changes
  useEffect(() => {
    if (expenses.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
    }
  }, [expenses]);

  const totalAmount = useMemo(() => {
    return expenses.reduce((sum, exp) => sum + exp.amount, 0);
  }, [expenses]);

  const handleOpenModal = (expense?: Expense) => {
    if (expense) {
      setEditingExpense(expense);
      setFormData({
        date: expense.date,
        item: expense.item,
        amount: expense.amount.toString(),
        note: expense.note || ''
      });
    } else {
      setEditingExpense(null);
      setFormData({
        date: new Date().toISOString().split('T')[0],
        item: '',
        amount: '',
        note: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(formData.amount);
    if (isNaN(amountNum) || !formData.item || !formData.date) return;

    if (editingExpense) {
      setExpenses(prev => prev.map(exp => 
        exp.id === editingExpense.id 
          ? { ...exp, ...formData, amount: amountNum } 
          : exp
      ));
    } else {
      const newExpense: Expense = {
        id: Date.now().toString(),
        date: formData.date,
        item: formData.item,
        amount: amountNum,
        note: formData.note
      };
      setExpenses(prev => [...prev, newExpense]);
    }

    setIsModalOpen(false);
    setEditingExpense(null);
  };

  const handleDeleteExpense = (id: string) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      setExpenses(prev => prev.filter(exp => exp.id !== id));
    }
  };

  const groupedExpenses = useMemo(() => {
    const groups: Record<string, Expense[]> = {};
    expenses.forEach(exp => {
      if (!groups[exp.date]) groups[exp.date] = [];
      groups[exp.date].push(exp);
    });
    return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]));
  }, [expenses]);

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white flex flex-col max-w-lg mx-auto relative overflow-hidden">
      
      {/* Header */}
      <header className="px-6 pt-10 pb-4 flex justify-between items-center z-10">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Expense Card</h1>
          <p className="text-gray-400 text-sm">Managing your daily spendings</p>
        </div>
        {view === 'all-records' && (
          <button 
            onClick={() => setView('dashboard')}
            className="p-2 glass rounded-full hover:bg-white/20 transition-all"
          >
            <ChevronLeft size={20} />
          </button>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 px-6 overflow-y-auto no-scrollbar pb-32">
        {view === 'dashboard' ? (
          <div className="space-y-6">
            {/* Total Summary Card */}
            <div className="glass rounded-3xl p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <FolderOpen size={100} className="text-amber-400" />
              </div>
              <p className="text-amber-400 font-medium mb-1 uppercase tracking-widest text-xs">Total Balance Spent</p>
              <h2 className="text-5xl font-bold mb-6">₹{totalAmount}</h2>
              
              <div className="space-y-3 max-h-[400px] overflow-y-auto no-scrollbar">
                {expenses.slice(-10).reverse().map((exp) => (
                  <div key={exp.id} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                    <div>
                      <p className="font-medium text-gray-200">{exp.item}</p>
                      <p className="text-[10px] text-gray-500">{new Date(exp.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</p>
                    </div>
                    <p className="text-amber-300 font-semibold">₹{exp.amount}</p>
                  </div>
                ))}
              </div>
              
              <button 
                onClick={() => setView('all-records')}
                className="mt-6 w-full py-4 glass rounded-2xl flex items-center justify-center gap-2 text-sm font-medium hover:bg-white/10 transition-all border border-amber-500/20"
              >
                <FolderOpen size={18} className="text-amber-400" />
                View All Records
              </button>
            </div>

            {/* Recent Activity Label */}
            <div className="flex justify-between items-center mt-8">
               <h3 className="text-lg font-semibold">Daily Breakdown</h3>
               <span className="px-3 py-1 bg-amber-500/10 text-amber-500 text-xs rounded-full border border-amber-500/20">Active</span>
            </div>

            <div className="space-y-4">
              {groupedExpenses.slice(0, 3).map(([date, items]) => (
                <div key={date} className="glass rounded-2xl p-5">
                   <p className="text-xs text-amber-400 mb-3 font-semibold uppercase tracking-wider">
                      {new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                   </p>
                   <div className="space-y-2">
                     {items.map(item => (
                       <div key={item.id} className="flex justify-between items-center">
                         <span className="text-gray-300 text-sm">{item.item}</span>
                         <span className="text-white font-medium text-sm">₹{item.amount}</span>
                       </div>
                     ))}
                   </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl font-bold">Historical Data</h3>
              <p className="text-amber-400 font-semibold">Total: ₹{totalAmount}</p>
            </div>
            
            <div className="space-y-8">
              {groupedExpenses.map(([date, items]) => (
                <div key={date} className="space-y-3">
                  <div className="flex items-center gap-4">
                    <h4 className="text-sm font-bold text-gray-500 shrink-0">
                      {new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </h4>
                    <div className="h-[1px] w-full bg-white/5"></div>
                  </div>
                  <div className="space-y-3">
                    {items.map(exp => (
                      <div key={exp.id} className="glass rounded-2xl p-4 flex justify-between items-center group">
                        <div>
                          <p className="font-semibold text-gray-100">{exp.item}</p>
                          {exp.note && <p className="text-xs text-gray-500">{exp.note}</p>}
                        </div>
                        <div className="flex items-center gap-4">
                          <p className="font-bold text-amber-400">₹{exp.amount}</p>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => handleOpenModal(exp)}
                              className="p-2 hover:bg-amber-500/20 rounded-lg text-amber-400 transition-colors"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button 
                              onClick={() => handleDeleteExpense(exp.id)}
                              className="p-2 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-20">
        <button 
          onClick={() => handleOpenModal()}
          className="gold-gradient p-5 rounded-full shadow-2xl gold-glow transition-transform hover:scale-110 active:scale-95 flex items-center justify-center"
        >
          <Plus size={32} className="text-white" strokeWidth={3} />
        </button>
      </div>

      {/* Custom Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="glass w-full max-w-md rounded-t-[2.5rem] sm:rounded-[2.5rem] p-8 relative z-10 animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">{editingExpense ? 'Update Record' : 'New Record'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 glass rounded-full text-gray-400">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSaveExpense} className="space-y-5">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-amber-500 uppercase tracking-wider">Date</label>
                <input 
                  type="date" 
                  required
                  value={formData.date}
                  onChange={e => setFormData(prev => ({...prev, date: e.target.value}))}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:outline-none focus:border-amber-500/50 transition-colors"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-amber-500 uppercase tracking-wider">Category / Item Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Petrol, Chai, Groceries"
                  value={formData.item}
                  onChange={e => setFormData(prev => ({...prev, item: e.target.value}))}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:outline-none focus:border-amber-500/50 transition-colors"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-amber-500 uppercase tracking-wider">Amount (₹)</label>
                <input 
                  type="number" 
                  required
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={e => setFormData(prev => ({...prev, amount: e.target.value}))}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:outline-none focus:border-amber-500/50 transition-colors"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-amber-500 uppercase tracking-wider">Note (Optional)</label>
                <input 
                  type="text" 
                  placeholder="Add a remark..."
                  value={formData.note}
                  onChange={e => setFormData(prev => ({...prev, note: e.target.value}))}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:outline-none focus:border-amber-500/50 transition-colors"
                />
              </div>
              
              <button 
                type="submit"
                className="w-full gold-gradient py-5 rounded-2xl font-bold text-lg shadow-xl shadow-amber-500/10 hover:shadow-amber-500/20 transition-all flex items-center justify-center gap-2 mt-4"
              >
                <Check size={20} />
                {editingExpense ? 'Save Changes' : 'Confirm Record'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Gradient Background Decoration */}
      <div className="fixed -top-20 -left-20 w-80 h-80 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="fixed -bottom-20 -right-20 w-80 h-80 bg-amber-600/10 rounded-full blur-[100px] pointer-events-none"></div>
    </div>
  );
};

export default App;
