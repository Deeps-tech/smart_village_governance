import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { 
  Users, AlertTriangle, Construction, Award, 
  CircleDollarSign, TrendingUp, HelpCircle 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';

interface MetricData {
  totalCitizens: number;
  activeGrievances: number;
  completedProjects: number;
  welfareBeneficiaries: number;
  totalBudgetAllocated: number;
  totalBudgetUsed: number;
  totalBudgetRemaining: number;
  budgetUsedByDepartment: Record<string, number>;
  grievanceStatusCounts: Record<string, number>;
}

const COLORS = ['#2563EB', '#16A34A', '#F59E0B', '#EF4444', '#8B5CF6'];

const Dashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<MetricData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await api.get('/dashboard/metrics');
        setMetrics(response.data);
      } catch (err: any) {
        setError('Failed to fetch dashboard metrics');
        // Pre-populate with dummy data for hackathon visualization fallback
        setMetrics({
          totalCitizens: 1240,
          activeGrievances: 18,
          completedProjects: 45,
          welfareBeneficiaries: 382,
          totalBudgetAllocated: 5000000,
          totalBudgetUsed: 3200000,
          totalBudgetRemaining: 1800000,
          budgetUsedByDepartment: {
            'INFRASTRUCTURE': 1800000,
            'SCHEMES': 900000,
            'HEALTH': 300000,
            'ADMINISTRATION': 200000,
          },
          grievanceStatusCounts: {
            'PENDING': 8,
            'IN_PROGRESS': 10,
            'RESOLVED': 32,
            'CLOSED': 14,
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-800 border-t-primary"></div>
      </div>
    );
  }

  const budgetData = metrics ? [
    { name: 'Allocated', Amount: metrics.totalBudgetAllocated },
    { name: 'Used', Amount: metrics.totalBudgetUsed },
    { name: 'Remaining', Amount: metrics.totalBudgetRemaining }
  ] : [];

  const deptBudgetData = metrics ? Object.entries(metrics.budgetUsedByDepartment).map(([key, val]) => ({
    name: key,
    Amount: val
  })) : [];

  const grievancePieData = metrics ? Object.entries(metrics.grievanceStatusCounts).map(([key, val]) => ({
    name: key,
    value: val
  })) : [];

  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {error && (
        <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg text-sm text-warning font-semibold flex items-center gap-2">
          <HelpCircle className="h-4 w-4" />
          Offline fallback data displayed. Verify local backend connectivity.
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Citizens */}
        <div className="glass-card p-6 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Total Citizens</p>
            <p className="text-3xl font-extrabold text-slate-100 mt-2">{metrics?.totalCitizens}</p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary-light">
            <Users className="h-6 w-6" />
          </div>
        </div>

        {/* Active Grievances */}
        <div className="glass-card p-6 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Active Grievances</p>
            <p className="text-3xl font-extrabold text-slate-100 mt-2">{metrics?.activeGrievances}</p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-danger/10 border border-danger/20 flex items-center justify-center text-danger-light">
            <AlertTriangle className="h-6 w-6" />
          </div>
        </div>

        {/* Infrastructure Projects */}
        <div className="glass-card p-6 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Completed Projects</p>
            <p className="text-3xl font-extrabold text-slate-100 mt-2">{metrics?.completedProjects}</p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-success/10 border border-success/20 flex items-center justify-center text-success-light">
            <Construction className="h-6 w-6" />
          </div>
        </div>

        {/* Welfare Beneficiaries */}
        <div className="glass-card p-6 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Welfare Beneficiaries</p>
            <p className="text-3xl font-extrabold text-slate-100 mt-2">{metrics?.welfareBeneficiaries}</p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-warning/10 border border-warning/20 flex items-center justify-center text-warning-light">
            <Award className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Budget Utilization bar */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <CircleDollarSign className="h-5 w-5 text-primary" />
              Budget Utilization Summary
            </h2>
            <span className="text-xs font-semibold text-slate-400">Financial Year 2026-27</span>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-6 text-center">
            <div className="p-3 bg-slate-900/40 border border-slate-800 rounded-lg">
              <span className="text-xs font-semibold text-slate-500">Allocated</span>
              <p className="text-md font-bold mt-1 text-slate-200">{formatter.format(metrics?.totalBudgetAllocated || 0)}</p>
            </div>
            <div className="p-3 bg-slate-900/40 border border-slate-800 rounded-lg">
              <span className="text-xs font-semibold text-slate-500">Spent</span>
              <p className="text-md font-bold mt-1 text-success-light">{formatter.format(metrics?.totalBudgetUsed || 0)}</p>
            </div>
            <div className="p-3 bg-slate-900/40 border border-slate-800 rounded-lg">
              <span className="text-xs font-semibold text-slate-500">Remaining</span>
              <p className="text-md font-bold mt-1 text-primary-light">{formatter.format(metrics?.totalBudgetRemaining || 0)}</p>
            </div>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={budgetData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} tickFormatter={(val) => `₹${val/100000}L`} />
                <Tooltip formatter={(value) => formatter.format(value as number)} />
                <Bar dataKey="Amount" fill="#2563EB" radius={[4, 4, 0, 0]}>
                  {budgetData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.name === 'Remaining' ? '#3B82F6' : entry.name === 'Used' ? '#16A34A' : '#2563EB'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Grievance Breakdown */}
        <div className="glass-panel p-6 rounded-xl flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2 mb-6">
              <AlertTriangle className="h-5 w-5 text-danger" />
              Grievance Breakdown
            </h2>
            <div className="h-60 w-full flex justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={grievancePieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {grievancePieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-4 border-t border-slate-800">
            {grievancePieData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                <span className="text-slate-400 font-medium truncate">{entry.name}: </span>
                <span className="text-slate-200 font-bold">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Department budget chart & details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-xl lg:col-span-1">
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2 mb-6">
            <TrendingUp className="h-5 w-5 text-success" />
            Budget Spent by Department
          </h2>
          <div className="space-y-4">
            {deptBudgetData.length === 0 ? (
              <p className="text-sm text-slate-500 font-semibold">No department spend log present.</p>
            ) : (
              deptBudgetData.map((item, idx) => (
                <div key={item.name} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300 font-semibold">{item.name}</span>
                    <span className="text-slate-100 font-bold">{formatter.format(item.Amount)}</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-primary h-full rounded-full" 
                      style={{ 
                        width: `${metrics ? (item.Amount / metrics.totalBudgetAllocated) * 100 : 0}%`,
                        backgroundColor: COLORS[idx % COLORS.length]
                      }}
                    ></div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick action buttons & summary */}
        <div className="glass-panel p-6 rounded-xl lg:col-span-2">
          <h2 className="text-lg font-bold text-slate-100 mb-6">Quick Portal Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-xl hover:border-primary/30 transition-all duration-300 cursor-pointer">
              <h3 className="font-bold text-sm text-slate-200">Submit Grievance</h3>
              <p className="text-xs text-slate-500 font-semibold mt-1">Register public, sanitation, utility, or road complaints.</p>
            </div>
            <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-xl hover:border-success/30 transition-all duration-300 cursor-pointer">
              <h3 className="font-bold text-sm text-slate-200">Apply for Schemes</h3>
              <p className="text-xs text-slate-500 font-semibold mt-1">View eligibility and register for digital welfare schemes.</p>
            </div>
            <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-xl hover:border-warning/30 transition-all duration-300 cursor-pointer">
              <h3 className="font-bold text-sm text-slate-200">Public Announcements</h3>
              <p className="text-xs text-slate-500 font-semibold mt-1">Check emergency alerts, notices, and village event feeds.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
