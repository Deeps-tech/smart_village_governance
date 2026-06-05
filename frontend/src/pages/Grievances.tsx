import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  AlertTriangle, FileText, CheckCircle, 
  Clock, Loader2, Plus, Calendar, User, 
  MapPin, ShieldAlert, Check, X, ClipboardCheck
} from 'lucide-react';

interface Grievance {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string; // PENDING, IN_PROGRESS, RESOLVED, CLOSED
  citizenId: string;
  assignedOfficerId: string;
  imageUrl: string;
  createdAt: string;
  resolvedAt?: string;
  resolutionNotes?: string;
}

const CATEGORIES = ['Water', 'Road', 'Electricity', 'Sanitation', 'Education', 'Other'];

const Grievances: React.FC = () => {
  const { user } = useAuth();
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [showFileModal, setShowFileModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedGrievance, setSelectedGrievance] = useState<Grievance | null>(null);

  // Form State for filing
  const [form, setForm] = useState({
    title: '',
    category: 'Water',
    description: '',
    imageUrl: '',
  });

  // Action states
  const [assignOfficerId, setAssignOfficerId] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchGrievances = async () => {
    setLoading(true);
    try {
      const response = await api.get('/grievances');
      setGrievances(response.data);
    } catch (err: any) {
      setError('Failed to load grievances');
      // Hackathon fallback
      setGrievances([
        {
          id: 'g1',
          title: 'Water tank pipe leakage in Ward 2',
          description: 'The main pipe feeding water to the public tank has a major crack. Hundreds of liters of clean water are being wasted daily, and the local supply pressure is very low.',
          category: 'Water',
          status: 'PENDING',
          citizenId: 'c1',
          assignedOfficerId: '',
          imageUrl: 'https://images.unsplash.com/photo-1542013936693-8848e574047a?q=80&w=400&auto=format&fit=crop',
          createdAt: '2026-06-02T10:30:00'
        },
        {
          id: 'g2',
          title: 'Street light broken near school crossing',
          description: 'The street light at the crossroads near Pipili secondary school has been out for three weeks. It is very dangerous for children and elderly walking home after sunset.',
          category: 'Electricity',
          status: 'IN_PROGRESS',
          citizenId: 'c2',
          assignedOfficerId: 'officer-01',
          imageUrl: '',
          createdAt: '2026-05-28T14:15:00'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrievances();
  }, []);

  const handleFileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/grievances', form);
      setShowFileModal(false);
      setForm({ title: '', category: 'Water', description: '', imageUrl: '' });
      fetchGrievances();
    } catch (err: any) {
      alert(err.response?.data || 'Failed to submit grievance');
    }
  };

  const handleAssign = async (grievanceId: string) => {
    if (!assignOfficerId) return;
    setUpdating(true);
    try {
      await api.put(`/grievances/${grievanceId}/assign`, { assignedOfficerId: assignOfficerId });
      setSelectedGrievance(null);
      setShowDetailModal(false);
      fetchGrievances();
    } catch (err: any) {
      alert('Failed to assign officer');
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateStatus = async (grievanceId: string, status: string) => {
    setUpdating(true);
    try {
      await api.put(`/grievances/${grievanceId}/status`, { 
        status, 
        resolutionNotes: status === 'RESOLVED' || status === 'CLOSED' ? resolutionNotes : null 
      });
      setSelectedGrievance(null);
      setShowDetailModal(false);
      setResolutionNotes('');
      fetchGrievances();
    } catch (err: any) {
      alert('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-danger/10 border-danger/20 text-danger-light';
      case 'IN_PROGRESS': return 'bg-warning/10 border-warning/20 text-warning-light';
      case 'RESOLVED': return 'bg-success/10 border-success/20 text-success-light';
      case 'CLOSED': return 'bg-slate-800 border-slate-700 text-slate-400';
      default: return 'bg-slate-900 border-slate-800 text-slate-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <Clock className="h-4.5 w-4.5 text-danger-light" />;
      case 'IN_PROGRESS': return <Loader2 className="h-4.5 w-4.5 text-warning-light animate-spin" />;
      case 'RESOLVED': return <CheckCircle className="h-4.5 w-4.5 text-success-light" />;
      case 'CLOSED': return <CheckCircle className="h-4.5 w-4.5 text-slate-500" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Grievance Redressal Portal</h2>
          <p className="text-sm text-slate-400">File complaints, track progress, and review resolutions.</p>
        </div>

        {user?.role === 'CITIZEN' && (
          <button onClick={() => setShowFileModal(true)} className="btn-primary shrink-0">
            <Plus className="h-4 w-4" />
            File Grievance
          </button>
        )}
      </div>

      {/* Grievances List */}
      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-800 border-t-primary"></div>
        </div>
      ) : grievances.length === 0 ? (
        <div className="glass-panel p-8 text-center text-slate-500 font-semibold rounded-xl">
          No complaints reported yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {grievances.map((g) => (
            <div 
              key={g.id} 
              onClick={() => {
                setSelectedGrievance(g);
                setAssignOfficerId(g.assignedOfficerId || '');
                setResolutionNotes(g.resolutionNotes || '');
                setShowDetailModal(true);
              }}
              className="glass-card p-6 rounded-xl cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <span className="text-xs font-bold text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">
                    {g.category}
                  </span>
                  <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2 py-0.5 rounded-full border ${getStatusBadgeClass(g.status)}`}>
                    {getStatusIcon(g.status)}
                    {g.status}
                  </span>
                </div>

                <h3 className="text-md font-bold text-slate-200 mt-4 leading-snug hover:text-primary transition-colors">
                  {g.title}
                </h3>
                <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                  {g.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-850 flex items-center justify-between text-xs text-slate-500 font-semibold">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(g.createdAt).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1 truncate max-w-[50%]">
                  <User className="h-4 w-4" />
                  {g.assignedOfficerId ? `Officer: ${g.assignedOfficerId}` : 'Unassigned'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: File Grievance (Citizen only) */}
      {showFileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl animate-scale-up">
            <div className="flex h-14 items-center justify-between px-6 bg-slate-950 border-b border-slate-850">
              <h3 className="font-bold text-slate-100 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-primary" />
                Submit New Grievance
              </h3>
              <button onClick={() => setShowFileModal(false)} className="text-slate-400 hover:text-slate-100">
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleFileSubmit} className="p-6 space-y-4">
              <div>
                <label className="form-label">Title / Subject *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({...form, title: e.target.value})}
                  className="form-input"
                  placeholder="E.g., Low water supply in Sector A"
                />
              </div>

              <div>
                <label className="form-label">Category *</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({...form, category: e.target.value})}
                  className="form-input"
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="form-label">Image Reference URL (Optional)</label>
                <input
                  type="text"
                  value={form.imageUrl}
                  onChange={(e) => setForm({...form, imageUrl: e.target.value})}
                  className="form-input"
                  placeholder="https://example.com/leakage.jpg"
                />
              </div>

              <div>
                <label className="form-label">Description of Complaint *</label>
                <textarea
                  required
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm({...form, description: e.target.value})}
                  className="form-input"
                  placeholder="Describe the issue, location, and details so officers can inspect it correctly..."
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button type="button" onClick={() => setShowFileModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">File Complaint</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Grievance Details & Action */}
      {showDetailModal && selectedGrievance && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl animate-scale-up max-h-[90vh] flex flex-col">
            <div className="flex h-14 items-center justify-between px-6 bg-slate-950 border-b border-slate-850 shrink-0">
              <h3 className="font-bold text-slate-100 flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Grievance Details #{selectedGrievance.id.substring(0, 5)}
              </h3>
              <button onClick={() => setShowDetailModal(false)} className="text-slate-400 hover:text-slate-100">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto">
              {/* Core info header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-850">
                <div>
                  <span className="text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700 px-2 py-0.5 rounded">
                    {selectedGrievance.category}
                  </span>
                  <p className="text-xs text-slate-500 font-semibold mt-1">
                    Filed on {new Date(selectedGrievance.createdAt).toLocaleString()}
                  </p>
                </div>
                <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${getStatusBadgeClass(selectedGrievance.status)}`}>
                  {getStatusIcon(selectedGrievance.status)}
                  {selectedGrievance.status}
                </span>
              </div>

              {/* Title & Description */}
              <div>
                <h4 className="font-extrabold text-slate-100 text-lg leading-snug">{selectedGrievance.title}</h4>
                <p className="text-sm text-slate-400 font-medium leading-relaxed mt-3 bg-slate-950/30 border border-slate-850 p-4 rounded-lg">
                  {selectedGrievance.description}
                </p>
              </div>

              {/* Image attachment if exists */}
              {selectedGrievance.imageUrl && (
                <div>
                  <span className="form-label">Attachment Image</span>
                  <div className="mt-2 rounded-lg overflow-hidden border border-slate-800 max-h-60 flex justify-center bg-slate-950">
                    <img 
                      src={selectedGrievance.imageUrl} 
                      alt="Grievance reference" 
                      className="object-contain h-full w-full"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Resolution details if resolved */}
              {(selectedGrievance.status === 'RESOLVED' || selectedGrievance.status === 'CLOSED') && (
                <div className="p-4 bg-success/5 border border-success/15 rounded-lg space-y-2">
                  <div className="flex items-center gap-2 text-success-light">
                    <ClipboardCheck className="h-5 w-5" />
                    <span className="text-sm font-bold">Resolution Report</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Resolved at: {selectedGrievance.resolvedAt ? new Date(selectedGrievance.resolvedAt).toLocaleString() : 'N/A'}
                  </p>
                  <p className="text-sm text-slate-200 mt-2 italic leading-relaxed">
                    "{selectedGrievance.resolutionNotes || 'No additional resolution notes logged.'}"
                  </p>
                </div>
              )}

              {/* Official Action Controls */}
              {user?.role !== 'CITIZEN' && (
                <div className="pt-6 border-t border-slate-850 space-y-4">
                  <h5 className="font-bold text-slate-200 text-sm">Official Actions</h5>

                  {/* Assignee Control */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                    <div className="sm:col-span-2">
                      <label className="form-label text-[10px]">Assign Officer ID</label>
                      <input
                        type="text"
                        value={assignOfficerId}
                        onChange={(e) => setAssignOfficerId(e.target.value)}
                        className="form-input"
                        placeholder="E.g., officer-01"
                      />
                    </div>
                    <button
                      type="button"
                      disabled={updating || selectedGrievance.assignedOfficerId === assignOfficerId}
                      onClick={() => handleAssign(selectedGrievance.id)}
                      className="btn-secondary h-10 w-full"
                    >
                      Update Assignee
                    </button>
                  </div>

                  {/* Resolution Notes for Update */}
                  {selectedGrievance.status !== 'RESOLVED' && selectedGrievance.status !== 'CLOSED' && (
                    <div className="space-y-4 pt-2">
                      <div>
                        <label className="form-label text-[10px]">Resolution / Actions Taken Notes</label>
                        <textarea
                          rows={3}
                          value={resolutionNotes}
                          onChange={(e) => setResolutionNotes(e.target.value)}
                          className="form-input"
                          placeholder="Provide details on action taken, repair completions, or inspection reports..."
                        ></textarea>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <button
                          type="button"
                          disabled={updating}
                          onClick={() => handleUpdateStatus(selectedGrievance.id, 'IN_PROGRESS')}
                          className="btn-secondary"
                        >
                          Mark IN PROGRESS
                        </button>
                        <button
                          type="button"
                          disabled={updating || !resolutionNotes}
                          onClick={() => handleUpdateStatus(selectedGrievance.id, 'RESOLVED')}
                          className="btn-success shrink-0"
                        >
                          Resolve Grievance
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Close control for resolved */}
                  {selectedGrievance.status === 'RESOLVED' && (
                    <div className="pt-2">
                      <button
                        type="button"
                        disabled={updating}
                        onClick={() => handleUpdateStatus(selectedGrievance.id, 'CLOSED')}
                        className="btn-secondary w-full"
                      >
                        Close Complaint (Archive)
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="px-6 py-4 bg-slate-950 border-t border-slate-850 shrink-0 flex justify-end">
              <button type="button" onClick={() => setShowDetailModal(false)} className="btn-secondary">Close Dialog</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Grievances;
