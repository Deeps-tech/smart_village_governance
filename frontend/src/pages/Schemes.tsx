import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Award, FileText, CheckCircle2, XCircle, 
  Clock, Plus, Calendar, Coins, UserCheck, 
  HelpCircle, ChevronRight, Check, X, ShieldAlert 
} from 'lucide-react';

interface Applicant {
  userId: string;
  citizenName: string;
  appliedDate: string;
  status: string; // PENDING, APPROVED, REJECTED
  remarks?: string;
}

interface Scheme {
  id: string;
  name: string;
  description: string;
  eligibilityCriteria: string;
  allocatedBudget: number;
  launchDate: string;
  status: string; // ACTIVE, CLOSED
  applicants: Applicant[];
}

const Schemes: React.FC = () => {
  const { user } = useAuth();
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);

  // Form: Create Scheme
  const [createForm, setCreateForm] = useState({
    name: '',
    description: '',
    eligibilityCriteria: '',
    allocatedBudget: 0,
    launchDate: '',
  });

  // Form: Apply
  const [applyForm, setApplyForm] = useState({
    citizenName: '',
    remarks: '',
  });

  // Action status
  const [approvalRemarks, setApprovalRemarks] = useState<Record<string, string>>({});
  const [updating, setUpdating] = useState(false);

  const fetchSchemes = async () => {
    setLoading(true);
    try {
      const response = await api.get('/schemes');
      setSchemes(response.data);
    } catch (err: any) {
      setError('Failed to fetch schemes');
      // Hackathon fallback
      setSchemes([
        {
          id: 's1',
          name: 'PM Kisan Samman Nidhi Yojana',
          description: 'An initiative by the government of India that provides up to ₹6,000 per year in three equal installments to small and marginal farmers.',
          eligibilityCriteria: 'Must own cultivable agricultural land up to 2 hectares, and be resident of Pipili village.',
          allocatedBudget: 1200000,
          launchDate: '2026-01-10',
          status: 'ACTIVE',
          applicants: [
            {
              userId: 'user-02',
              citizenName: 'Ramesh Senapati',
              appliedDate: '2026-05-15T09:00:00',
              status: 'PENDING',
              remarks: 'Applying for family aid'
            },
            {
              userId: 'user-03',
              citizenName: 'Harihar Das',
              appliedDate: '2026-05-20T11:30:00',
              status: 'APPROVED',
              remarks: 'Documents verified and approved.'
            }
          ]
        },
        {
          id: 's2',
          name: 'Mukhyamantri Krushi Udyog Yojana',
          description: 'A scheme providing capital investment subsidy to farmers/entrepreneurs for setting up commercial agri-enterprises.',
          eligibilityCriteria: 'Should be agricultural entrepreneur. Age limit: 18 to 45 years.',
          allocatedBudget: 800000,
          launchDate: '2026-03-01',
          status: 'ACTIVE',
          applicants: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchemes();
  }, []);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/schemes', createForm);
      setShowCreateModal(false);
      setCreateForm({ name: '', description: '', eligibilityCriteria: '', allocatedBudget: 0, launchDate: '' });
      fetchSchemes();
    } catch (err: any) {
      alert(err.response?.data || 'Failed to create scheme');
    }
  };

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedScheme) return;
    try {
      await api.post(`/schemes/${selectedScheme.id}/apply`, applyForm);
      setShowApplyModal(false);
      setApplyForm({ citizenName: '', remarks: '' });
      setSelectedScheme(null);
      fetchSchemes();
      alert('Application submitted successfully!');
    } catch (err: any) {
      alert(err.response?.data || 'Failed to submit application');
    }
  };

  const handleApproval = async (schemeId: string, userId: string, status: 'APPROVED' | 'REJECTED') => {
    setUpdating(true);
    const remarks = approvalRemarks[userId] || '';
    try {
      await api.put(`/schemes/${schemeId}/applicants/${userId}/status`, {
        status,
        remarks
      });
      // Refresh current modal scheme
      const refreshedSchemes = await api.get('/schemes');
      const updated = refreshedSchemes.data.find((s: Scheme) => s.id === schemeId);
      if (updated) setSelectedScheme(updated);
      
      setApprovalRemarks(prev => ({ ...prev, [userId]: '' }));
      fetchSchemes();
    } catch (err: any) {
      alert('Failed to update application status');
    } finally {
      setUpdating(false);
    }
  };

  const getApplicationStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-warning/10 border-warning/20 text-warning-light';
      case 'APPROVED': return 'bg-success/10 border-success/20 text-success-light';
      case 'REJECTED': return 'bg-danger/10 border-danger/20 text-danger-light';
      default: return 'bg-slate-800 text-slate-400';
    }
  };

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
          <h2 className="text-xl font-bold text-slate-100">Welfare Schemes Management</h2>
          <p className="text-sm text-slate-400">Launch social assistance schemes, track applications, and view beneficiaries.</p>
        </div>

        {user?.role !== 'CITIZEN' && (
          <button onClick={() => setShowCreateModal(true)} className="btn-primary shrink-0">
            <Plus className="h-4 w-4" />
            Launch Scheme
          </button>
        )}
      </div>

      {/* Schemes Grid */}
      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-800 border-t-primary"></div>
        </div>
      ) : schemes.length === 0 ? (
        <div className="glass-panel p-8 text-center text-slate-500 font-semibold rounded-xl">
          No schemes active at this time.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {schemes.map((scheme) => {
            const hasApplied = user && scheme.applicants.some(a => a.userId === user.id);
            const userApplication = user && scheme.applicants.find(a => a.userId === user.id);

            return (
              <div key={scheme.id} className="glass-card p-6 rounded-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded">
                      {scheme.status}
                    </span>
                    <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      Launched: {new Date(scheme.launchDate).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-md font-bold text-slate-200 mt-4 leading-snug">{scheme.name}</h3>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">{scheme.description}</p>

                  <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
                    <div className="p-2 bg-slate-900/40 border border-slate-800 rounded">
                      <span className="text-slate-500 font-semibold block">Total Budget</span>
                      <span className="text-slate-200 font-bold flex items-center gap-0.5 mt-0.5">
                        <Coins className="h-3.5 w-3.5 text-primary-light" />
                        {formatter.format(scheme.allocatedBudget)}
                      </span>
                    </div>
                    <div className="p-2 bg-slate-900/40 border border-slate-800 rounded">
                      <span className="text-slate-500 font-semibold block">Applicants</span>
                      <span className="text-slate-200 font-bold flex items-center gap-0.5 mt-0.5">
                        <UserCheck className="h-3.5 w-3.5 text-success-light" />
                        {scheme.applicants.length} registered
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-850 flex items-center justify-between gap-3">
                  {user?.role === 'CITIZEN' ? (
                    hasApplied ? (
                      <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border ${getApplicationStatusBadge(userApplication?.status || '')}`}>
                        Application Status: {userApplication?.status}
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedScheme(scheme);
                          setShowApplyModal(true);
                        }}
                        className="btn-primary py-2 text-xs w-full justify-center"
                      >
                        Apply for Scheme
                      </button>
                    )
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedScheme(scheme);
                        setShowDetailsModal(true);
                      }}
                      className="btn-secondary py-2 text-xs w-full justify-center"
                    >
                      Manage Applicants ({scheme.applicants.filter(a => a.status === 'PENDING').length} pending)
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Create Scheme */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl animate-scale-up">
            <div className="flex h-14 items-center justify-between px-6 bg-slate-950 border-b border-slate-850">
              <h3 className="font-bold text-slate-100 flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Launch New Welfare Scheme
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-100">
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
              <div>
                <label className="form-label">Scheme Name *</label>
                <input
                  type="text"
                  required
                  value={createForm.name}
                  onChange={(e) => setCreateForm({...createForm, name: e.target.value})}
                  className="form-input"
                  placeholder="E.g., PM Kisan Subsidy Aid"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Allocated Budget (INR) *</label>
                  <input
                    type="number"
                    required
                    value={createForm.allocatedBudget}
                    onChange={(e) => setCreateForm({...createForm, allocatedBudget: parseFloat(e.target.value)})}
                    className="form-input"
                    placeholder="E.g., 500000"
                  />
                </div>
                <div>
                  <label className="form-label">Launch Date *</label>
                  <input
                    type="date"
                    required
                    value={createForm.launchDate}
                    onChange={(e) => setCreateForm({...createForm, launchDate: e.target.value})}
                    className="form-input"
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Eligibility Criteria Description *</label>
                <textarea
                  required
                  rows={3}
                  value={createForm.eligibilityCriteria}
                  onChange={(e) => setCreateForm({...createForm, eligibilityCriteria: e.target.value})}
                  className="form-input"
                  placeholder="E.g., Small farmers owning less than 2 acres of land..."
                ></textarea>
              </div>

              <div>
                <label className="form-label">Detailed Scheme Description *</label>
                <textarea
                  required
                  rows={4}
                  value={createForm.description}
                  onChange={(e) => setCreateForm({...createForm, description: e.target.value})}
                  className="form-input"
                  placeholder="Provide description of scheme benefits and distribution steps..."
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button type="button" onClick={() => setShowCreateModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Launch Scheme</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Apply */}
      {showApplyModal && selectedScheme && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl animate-scale-up">
            <div className="flex h-14 items-center justify-between px-6 bg-slate-950 border-b border-slate-850">
              <h3 className="font-bold text-slate-100 flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Apply: {selectedScheme.name}
              </h3>
              <button onClick={() => { setShowApplyModal(false); setSelectedScheme(null); }} className="text-slate-400 hover:text-slate-100">
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleApplySubmit} className="p-6 space-y-4">
              <div className="p-3 bg-primary/5 border border-primary/15 rounded text-xs text-slate-400 space-y-1">
                <span className="font-bold text-slate-300 block mb-1">Scheme Eligibility Criteria:</span>
                "{selectedScheme.eligibilityCriteria}"
              </div>

              <div>
                <label className="form-label">Applicant Full Name *</label>
                <input
                  type="text"
                  required
                  value={applyForm.citizenName}
                  onChange={(e) => setApplyForm({...applyForm, citizenName: e.target.value})}
                  className="form-input"
                  placeholder="Enter your registered census name"
                />
              </div>

              <div>
                <label className="form-label">Application Remarks / Statement</label>
                <textarea
                  rows={3}
                  value={applyForm.remarks}
                  onChange={(e) => setApplyForm({...applyForm, remarks: e.target.value})}
                  className="form-input"
                  placeholder="E.g., I meet all land ownership parameters and request verification..."
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button 
                  type="button" 
                  onClick={() => { setShowApplyModal(false); setSelectedScheme(null); }} 
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">Submit Application</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Scheme Details & Applicants List (Officer only) */}
      {showDetailsModal && selectedScheme && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl animate-scale-up max-h-[90vh] flex flex-col">
            <div className="flex h-14 items-center justify-between px-6 bg-slate-950 border-b border-slate-850 shrink-0">
              <h3 className="font-bold text-slate-100 flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-primary" />
                Applications: {selectedScheme.name}
              </h3>
              <button onClick={() => { setShowDetailsModal(false); setSelectedScheme(null); }} className="text-slate-400 hover:text-slate-100">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              <div className="p-4 bg-slate-950 border border-slate-850 rounded-lg">
                <h4 className="font-bold text-slate-300 text-xs uppercase tracking-wider mb-2">Scheme Summary</h4>
                <p className="text-xs text-slate-400">{selectedScheme.description}</p>
                <p className="text-xs text-slate-500 mt-2 font-bold">Eligibility: "{selectedScheme.eligibilityCriteria}"</p>
              </div>

              <h4 className="font-extrabold text-slate-200 text-sm">Applications List</h4>
              {selectedScheme.applicants.length === 0 ? (
                <p className="text-center text-slate-500 font-semibold text-sm py-4">No applications registered for this scheme yet.</p>
              ) : (
                <div className="space-y-4">
                  {selectedScheme.applicants.map((app) => (
                    <div key={app.userId} className="p-4 bg-slate-900/60 border border-slate-850 rounded-lg space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <p className="text-sm font-bold text-slate-200">{app.citizenName}</p>
                          <p className="text-[10px] text-slate-500 font-semibold">Applied: {new Date(app.appliedDate).toLocaleDateString()}</p>
                        </div>
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${getApplicationStatusBadge(app.status)}`}>
                          {app.status}
                        </span>
                      </div>

                      <p className="text-xs text-slate-400">Remarks: "{app.remarks || 'No remarks provided.'}"</p>

                      {app.status === 'PENDING' && (
                        <div className="pt-3 border-t border-slate-850/50 flex flex-col sm:flex-row sm:items-center gap-3">
                          <input
                            type="text"
                            placeholder="Add verification notes/remarks..."
                            value={approvalRemarks[app.userId] || ''}
                            onChange={(e) => setApprovalRemarks({...approvalRemarks, [app.userId]: e.target.value})}
                            className="form-input text-xs sm:flex-1 h-9 py-1"
                          />
                          <div className="flex gap-2 shrink-0">
                            <button
                              onClick={() => handleApproval(selectedScheme.id, app.userId, 'REJECTED')}
                              disabled={updating}
                              className="px-2.5 py-1.5 text-xs font-bold bg-danger/10 text-danger-light border border-danger/20 rounded hover:bg-danger/20"
                            >
                              Reject
                            </button>
                            <button
                              onClick={() => handleApproval(selectedScheme.id, app.userId, 'APPROVED')}
                              disabled={updating}
                              className="px-2.5 py-1.5 text-xs font-bold bg-success/10 text-success-light border border-success/20 rounded hover:bg-success/20"
                            >
                              Approve
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="px-6 py-4 bg-slate-950 border-t border-slate-850 shrink-0 flex justify-end">
              <button 
                type="button" 
                onClick={() => { setShowDetailsModal(false); setSelectedScheme(null); }} 
                className="btn-secondary"
              >
                Close Dialog
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Schemes;
