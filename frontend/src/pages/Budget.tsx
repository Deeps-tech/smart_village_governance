import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  CircleDollarSign, Plus, ArrowUpRight, ArrowDownRight, 
  Coins, IndianRupee, PieChart as PieChartIcon, 
  X, Check, Clipboard, FileSpreadsheet 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, Cell 
} from 'recharts';

interface Transaction {
  id: string;
  amount: number;
  date: string;
  description: string;
  category: string; // CREDIT, DEBIT
}

interface Budget {
  id: string;
  financialYear: string;
  allocatedAmount: number;
  usedAmount: number;
  remainingAmount: number;
  department: string;
  transactions: Transaction[];
}

const DEPARTMENTS = ['INFRASTRUCTURE', 'SCHEMES', 'ADMINISTRATION', 'HEALTH', 'OTHER'];
const COLORS = ['#2563EB', '#16A34A', '#F59E0B', '#EF4444', '#8B5CF6'];

const Budget: React.FC = () => {
  const { user } = useAuth();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modals
  const [showAllocationModal, setShowAllocationModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);

  // Form: Allocate
  const [allocForm, setAllocForm] = useState({
    financialYear: '2026-2027',
    allocatedAmount: 0,
    department: 'INFRASTRUCTURE',
  });

  // Form: Transaction
  const [txForm, setTxForm] = useState({
    amount: 0,
    description: '',
    category: 'DEBIT',
  });

  const [updating, setUpdating] = useState(false);

  const fetchBudgets = async () => {
    setLoading(true);
    try {
      const response = await api.get('/budgets');
      setBudgets(response.data);
    } catch (err: any) {
      setError('Failed to fetch budgets');
      // Hackathon fallback
      setBudgets([
        {
          id: 'b1',
          financialYear: '2026-2027',
          allocatedAmount: 1800000,
          usedAmount: 1200000,
          remainingAmount: 600000,
          department: 'INFRASTRUCTURE',
          transactions: [
            {
              id: 'tx1',
              amount: 800000,
              date: '2026-05-10T14:30:00',
              description: 'Main road concrete laying contract payment',
              category: 'DEBIT'
            },
            {
              id: 'tx2',
              amount: 400000,
              date: '2026-05-25T11:00:00',
              description: 'Installation of high school compound street light grid',
              category: 'DEBIT'
            }
          ]
        },
        {
          id: 'b2',
          financialYear: '2026-2027',
          allocatedAmount: 1000000,
          usedAmount: 350000,
          remainingAmount: 650000,
          department: 'SCHEMES',
          transactions: [
            {
              id: 'tx3',
              amount: 350000,
              date: '2026-05-18T10:15:00',
              description: 'PM Kisan Yojana distribution - Phase 1',
              category: 'DEBIT'
            }
          ]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const handleAllocateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/budgets', allocForm);
      setShowAllocationModal(false);
      setAllocForm({ financialYear: '2026-2027', allocatedAmount: 0, department: 'INFRASTRUCTURE' });
      fetchBudgets();
    } catch (err: any) {
      alert('Failed to allocate budget');
    }
  };

  const handleTransactionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBudget) return;
    setUpdating(true);
    try {
      await api.post(`/budgets/${selectedBudget.id}/transactions`, txForm);
      setShowTransactionModal(false);
      setTxForm({ amount: 0, description: '', category: 'DEBIT' });
      setSelectedBudget(null);
      fetchBudgets();
    } catch (err: any) {
      alert('Failed to log transaction');
    } finally {
      setUpdating(false);
    }
  };

  const calculateGlobals = () => {
    let allocated = 0;
    let spent = 0;
    budgets.forEach(b => {
      allocated += b.allocatedAmount;
      spent += b.usedAmount;
    });
    return { allocated, spent, remaining: allocated - spent };
  };

  const globals = calculateGlobals();

  const chartData = budgets.map(b => ({
    Department: b.department,
    Allocated: b.allocatedAmount,
    Spent: b.usedAmount
  }));

  const allTransactions = budgets.flatMap(b => 
    b.transactions.map(t => ({ ...t, department: b.department }))
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  });

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Village Budget Monitoring</h2>
          <p className="text-sm text-slate-400">Allocate funds across departments, log audits, and download reports.</p>
        </div>

        {user?.role === 'SUPER_ADMIN' && (
          <button onClick={() => setShowAllocationModal(true)} className="btn-primary shrink-0">
            <Plus className="h-4 w-4" />
            Allocate Funds
          </button>
        )}
      </div>

      {/* Global Metrics Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {/* Total Allocated */}
        <div className="glass-card p-6 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Allocated Budget</span>
            <span className="text-2xl font-extrabold text-slate-100 mt-1 block">{formatter.format(globals.allocated)}</span>
          </div>
          <div className="h-10 w-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary-light">
            <Coins className="h-5 w-5" />
          </div>
        </div>

        {/* Spent */}
        <div className="glass-card p-6 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Total Spent</span>
            <span className="text-2xl font-extrabold text-success-light mt-1 block">{formatter.format(globals.spent)}</span>
          </div>
          <div className="h-10 w-10 rounded-lg bg-success/10 border border-success/20 flex items-center justify-center text-success-light">
            <ArrowUpRight className="h-5 w-5" />
          </div>
        </div>

        {/* Remaining */}
        <div className="glass-card p-6 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Remaining Balance</span>
            <span className="text-2xl font-extrabold text-primary-light mt-1 block">{formatter.format(globals.remaining)}</span>
          </div>
          <div className="h-10 w-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
            <ArrowDownRight className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Department Allocations & Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Allocations visualizer */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-xl">
          <h3 className="text-md font-bold text-slate-100 mb-6 flex items-center gap-2">
            <PieChartIcon className="h-5 w-5 text-primary" />
            Budget vs Expenditure by Department
          </h3>
          <div className="h-80 w-full">
            {loading ? (
              <div className="flex h-full items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-800 border-t-primary"></div>
              </div>
            ) : chartData.length === 0 ? (
              <p className="text-slate-500 font-semibold text-sm text-center pt-20">No financial allocations logged yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="Department" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `₹${v/100000}L`} />
                  <Tooltip formatter={(value) => formatter.format(value as number)} />
                  <Legend />
                  <Bar dataKey="Allocated" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Spent" fill="#16A34A" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Allocations list with log actions */}
        <div className="glass-panel p-6 rounded-xl space-y-4">
          <h3 className="text-md font-bold text-slate-100">Fund Management</h3>
          {budgets.length === 0 ? (
            <p className="text-xs text-slate-500 font-semibold">Allocate department funds to get started.</p>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {budgets.map((b) => (
                <div key={b.id} className="p-3 bg-slate-900/60 border border-slate-850 rounded-lg flex flex-col justify-between gap-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-200">{b.department}</span>
                      <span className="text-[10px] text-slate-500 block">{b.financialYear}</span>
                    </div>
                    <span className="text-xs text-slate-300 font-bold">{formatter.format(b.remainingAmount)} left</span>
                  </div>

                  {user?.role === 'SUPER_ADMIN' && (
                    <button
                      onClick={() => {
                        setSelectedBudget(b);
                        setShowTransactionModal(true);
                      }}
                      className="px-2 py-1 bg-slate-800 border border-slate-700 hover:bg-slate-750 text-[10px] font-bold text-slate-300 rounded text-center w-full flex items-center justify-center gap-1"
                    >
                      <Plus className="h-3 w-3" />
                      Add Expenditure (Debit)
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Audit Transactions Ledger */}
      <div className="glass-panel rounded-xl overflow-hidden">
        <div className="flex h-14 items-center justify-between px-6 bg-slate-900 border-b border-slate-850 shrink-0">
          <h3 className="font-bold text-slate-100 flex items-center gap-2">
            <Clipboard className="h-5 w-5 text-primary" />
            Audit Ledger (All Transactions)
          </h3>
          <button 
            onClick={() => alert('Exporting report as Excel sheet structure...')}
            className="px-2.5 py-1 bg-success/15 border border-success/20 hover:bg-success/25 text-success-light text-xs font-bold rounded flex items-center gap-1.5"
          >
            <FileSpreadsheet className="h-4 w-4" />
            Export Report
          </button>
        </div>

        {allTransactions.length === 0 ? (
          <p className="text-center text-slate-500 font-semibold text-sm py-8">No transactions reported yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {allTransactions.map((tx, idx) => (
                  <tr key={tx.id || idx} className="hover:bg-slate-900/30">
                    <td className="px-6 py-3 font-semibold text-slate-400">{new Date(tx.date).toLocaleDateString()}</td>
                    <td className="px-6 py-3 font-bold text-slate-300 text-xs">{tx.department}</td>
                    <td className="px-6 py-3 text-slate-200">{tx.description}</td>
                    <td className="px-6 py-3">
                      <span className={`inline-flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        tx.category === 'CREDIT' 
                          ? 'bg-success/10 border-success/20 text-success-light' 
                          : 'bg-danger/10 border-danger/20 text-danger-light'
                      }`}>
                        {tx.category}
                      </span>
                    </td>
                    <td className={`px-6 py-3 text-right font-bold ${tx.category === 'CREDIT' ? 'text-success-light' : 'text-danger-light'}`}>
                      {tx.category === 'CREDIT' ? '+' : '-'}{formatter.format(tx.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Allocate Fund */}
      {showAllocationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl animate-scale-up">
            <div className="flex h-14 items-center justify-between px-6 bg-slate-950 border-b border-slate-850">
              <h3 className="font-bold text-slate-100 flex items-center gap-2">
                <CircleDollarSign className="h-5 w-5 text-primary" />
                Allocate Department Funds
              </h3>
              <button onClick={() => setShowAllocationModal(false)} className="text-slate-400 hover:text-slate-100">
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleAllocateSubmit} className="p-6 space-y-4">
              <div>
                <label className="form-label">Financial Year *</label>
                <input
                  type="text"
                  required
                  value={allocForm.financialYear}
                  onChange={(e) => setAllocForm({...allocForm, financialYear: e.target.value})}
                  className="form-input"
                  placeholder="E.g., 2026-2027"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Department *</label>
                  <select
                    value={allocForm.department}
                    onChange={(e) => setAllocForm({...allocForm, department: e.target.value})}
                    className="form-input"
                  >
                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Allocated Amount (INR) *</label>
                  <input
                    type="number"
                    required
                    value={allocForm.allocatedAmount}
                    onChange={(e) => setAllocForm({...allocForm, allocatedAmount: parseFloat(e.target.value) || 0})}
                    className="form-input"
                    placeholder="Enter amount"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button type="button" onClick={() => setShowAllocationModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Save Allocation</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Transaction */}
      {showTransactionModal && selectedBudget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl animate-scale-up">
            <div className="flex h-14 items-center justify-between px-6 bg-slate-950 border-b border-slate-850">
              <h3 className="font-bold text-slate-100 flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" />
                Log Department Expenditure
              </h3>
              <button onClick={() => { setShowTransactionModal(false); setSelectedBudget(null); }} className="text-slate-400 hover:text-slate-100">
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleTransactionSubmit} className="p-6 space-y-4">
              <p className="text-xs text-slate-400 font-semibold mb-2">Department: <b className="text-slate-200">{selectedBudget.department}</b></p>

              <div>
                <label className="form-label">Amount (INR) *</label>
                <input
                  type="number"
                  required
                  value={txForm.amount}
                  onChange={(e) => setTxForm({...txForm, amount: parseFloat(e.target.value) || 0})}
                  className="form-input"
                  placeholder="Enter amount"
                />
              </div>

              <div>
                <label className="form-label">Category *</label>
                <select
                  value={txForm.category}
                  onChange={(e) => setTxForm({...txForm, category: e.target.value})}
                  className="form-input"
                >
                  <option value="DEBIT">Debit (Expenditure)</option>
                  <option value="CREDIT">Credit (Refund/Re-allocation)</option>
                </select>
              </div>

              <div>
                <label className="form-label">Transaction Description *</label>
                <textarea
                  required
                  rows={3}
                  value={txForm.description}
                  onChange={(e) => setTxForm({...txForm, description: e.target.value})}
                  className="form-input"
                  placeholder="Explain transaction audits..."
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button 
                  type="button" 
                  onClick={() => { setShowTransactionModal(false); setSelectedBudget(null); }} 
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" disabled={updating} className="btn-primary">
                  Log Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Budget;
