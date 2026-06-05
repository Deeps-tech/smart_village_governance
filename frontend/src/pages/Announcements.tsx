import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Megaphone, Plus, Calendar, AlertOctagon, 
  Info, X, ToggleLeft, ToggleRight, Trash2 
} from 'lucide-react';

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: string; // PUBLIC, EMERGENCY, EVENT
  createdAt: string;
  expiresAt: string;
  postedBy: string;
  active: boolean;
}

const Announcements: React.FC = () => {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [typeFilter, setTypeFilter] = useState('ALL');

  // Form State
  const [form, setForm] = useState({
    title: '',
    content: '',
    type: 'PUBLIC',
    expiresAt: '',
  });

  const [updating, setUpdating] = useState(false);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const response = await api.get(user?.role === 'CITIZEN' ? '/announcements' : '/announcements/all');
      setAnnouncements(response.data);
    } catch (err: any) {
      setError('Failed to fetch announcements');
      // Hackathon fallback
      setAnnouncements([
        {
          id: 'a1',
          title: 'Emergency: Heavy rainfall alert & safety measures',
          content: 'The Meteorological Department has issued a red alert for Heavy Rainfall over the next 48 hours. Citizens are advised to avoid waterlogging zones near the river bank and keep emergency contacts ready. Panchayat shelter room is active.',
          type: 'EMERGENCY',
          createdAt: '2026-06-04T18:00:00',
          expiresAt: '2026-06-07T18:00:00',
          postedBy: 'admin',
          active: true
        },
        {
          id: 'a2',
          title: 'Gram Sabha Panchayat Assembly meeting scheduled',
          content: 'A public assembly of all village heads and citizens is scheduled at the main panchayat office hall to discuss roads maintenance projects and scheme distributions.',
          type: 'EVENT',
          createdAt: '2026-06-03T10:00:00',
          expiresAt: '2026-06-10T10:00:00',
          postedBy: 'officer-01',
          active: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/announcements', {
        ...form,
        expiresAt: form.expiresAt ? `${form.expiresAt}T23:59:59` : null
      });
      setShowAddModal(false);
      setForm({ title: '', content: '', type: 'PUBLIC', expiresAt: '' });
      fetchAnnouncements();
    } catch (err: any) {
      alert('Failed to post announcement');
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await api.put(`/announcements/${id}/active`, { active: !currentStatus });
      fetchAnnouncements();
    } catch (err: any) {
      alert('Failed to toggle status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this announcement?')) return;
    try {
      await api.delete(`/announcements/${id}`);
      fetchAnnouncements();
    } catch (err: any) {
      alert('Failed to delete announcement');
    }
  };

  const filteredAnnouncements = announcements.filter(a => {
    if (typeFilter === 'ALL') return true;
    return a.type === typeFilter;
  });

  const getCardStyle = (type: string) => {
    switch (type) {
      case 'EMERGENCY': return 'bg-danger/5 border-danger/25 text-slate-100 shadow-danger/5 shadow-md';
      case 'EVENT': return 'bg-slate-900 border-primary/20 text-slate-100';
      default: return 'bg-slate-900 border-slate-800 text-slate-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Village Bulletin Announcements</h2>
          <p className="text-sm text-slate-400">View public announcements, emergency warnings, and scheduled panchayat events.</p>
        </div>

        {user?.role !== 'CITIZEN' && (
          <button onClick={() => setShowAddModal(true)} className="btn-primary shrink-0">
            <Plus className="h-4 w-4" />
            Post Announcement
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 pt-2">
        {['ALL', 'PUBLIC', 'EMERGENCY', 'EVENT'].map(t => (
          <button
            key={t}
            onClick={() => setTypeFilter(t)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 border ${
              typeFilter === t
                ? 'bg-primary text-white border-primary shadow-sm shadow-primary/20'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            {t === 'ALL' ? 'All Bulletins' : `${t} Notices`}
          </button>
        ))}
      </div>

      {/* Announcements List */}
      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-800 border-t-primary"></div>
        </div>
      ) : filteredAnnouncements.length === 0 ? (
        <p className="glass-panel p-8 text-center text-slate-500 font-semibold rounded-xl">No bulletins posted under this filter.</p>
      ) : (
        <div className="space-y-4">
          {filteredAnnouncements.map((item) => (
            <div 
              key={item.id} 
              className={`p-5 rounded-xl border flex flex-col justify-between md:flex-row md:items-start gap-4 transition-all duration-200 hover:border-slate-700/60 ${getCardStyle(item.type)}`}
            >
              <div className="space-y-3 md:flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                    item.type === 'EMERGENCY' 
                      ? 'bg-danger/20 border-danger/35 text-danger-light animate-pulse'
                      : item.type === 'EVENT'
                        ? 'bg-primary/20 border-primary/30 text-primary-light'
                        : 'bg-slate-850 border-slate-800 text-slate-400'
                  }`}>
                    {item.type === 'EMERGENCY' ? <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-danger animate-ping"></span> : null}
                    {item.type}
                  </span>
                  
                  <span className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    Posted: {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="text-md font-bold text-slate-200 leading-snug">{item.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed font-medium">{item.content}</p>
                
                <p className="text-[10px] text-slate-500 font-semibold">Posted by: <b>@{item.postedBy}</b></p>
              </div>

              {user?.role !== 'CITIZEN' && (
                <div className="flex md:flex-col items-center justify-end gap-3 pt-3 md:pt-0 border-t border-slate-850 md:border-t-0 md:pl-4 shrink-0">
                  <button
                    onClick={() => handleToggleActive(item.id, item.active)}
                    className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1.5 rounded border transition-colors ${
                      item.active 
                        ? 'bg-success/10 border-success/20 text-success-light hover:bg-success/20' 
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-750'
                    }`}
                  >
                    {item.active ? <ToggleRight className="h-4.5 w-4.5" /> : <ToggleLeft className="h-4.5 w-4.5" />}
                    {item.active ? 'Active' : 'Archived'}
                  </button>
                  
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="px-2.5 py-1.5 bg-danger/10 border border-danger/20 hover:bg-danger/25 text-danger-light text-xs font-bold rounded flex items-center gap-1"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal: Post Announcement */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl animate-scale-up">
            <div className="flex h-14 items-center justify-between px-6 bg-slate-950 border-b border-slate-850">
              <h3 className="font-bold text-slate-100 flex items-center gap-2">
                <Megaphone className="h-5 w-5 text-primary" />
                Post Bulletin Notice
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-100">
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="form-label">Notice Title *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({...form, title: e.target.value})}
                  className="form-input"
                  placeholder="E.g., Drinking water pipeline maintenance schedule"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Notice Type *</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({...form, type: e.target.value})}
                    className="form-input"
                  >
                    <option value="PUBLIC">Public Notice</option>
                    <option value="EMERGENCY">Emergency Notice</option>
                    <option value="EVENT">Panchayat Event</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Expiry Date</label>
                  <input
                    type="date"
                    value={form.expiresAt}
                    onChange={(e) => setForm({...form, expiresAt: e.target.value})}
                    className="form-input"
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Bulletin Content *</label>
                <textarea
                  required
                  rows={4}
                  value={form.content}
                  onChange={(e) => setForm({...form, content: e.target.value})}
                  className="form-input"
                  placeholder="Type bulletin board message details here..."
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Post Bulletin</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Announcements;
