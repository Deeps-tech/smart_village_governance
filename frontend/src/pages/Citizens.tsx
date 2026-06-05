import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Search, UserPlus, Filter, ShieldAlert, Check, X, FileText } from 'lucide-react';

interface Citizen {
  id: string;
  name: string;
  email: string;
  phone: string;
  aadhaarRef: string;
  occupation: string;
  gender: string;
  dateOfBirth: string;
  familyHeadId: string;
  relationshipToHead: string;
  address: string;
  status: string;
}

const Citizens: React.FC = () => {
  const { user } = useAuth();
  const [citizens, setCitizens] = useState<Citizen[]>([]);
  const [searchName, setSearchName] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'CREATE' | 'EDIT'>('CREATE');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  // Form State
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    aadhaarRef: '',
    occupation: '',
    gender: 'MALE',
    dateOfBirth: '',
    familyHeadId: '',
    relationshipToHead: 'SELF',
    address: '',
    status: 'ACTIVE'
  });

  const fetchCitizens = async () => {
    setLoading(true);
    try {
      const response = await api.get('/citizens', {
        params: searchName ? { name: searchName } : {}
      });
      setCitizens(response.data);
    } catch (err: any) {
      setError('Failed to fetch citizen records');
      // Hackathon fallback
      setCitizens([
        {
          id: '1',
          name: 'Rajesh Kumar',
          email: 'rajesh.k@gmail.com',
          phone: '9876543210',
          aadhaarRef: 'XXXX-XXXX-3829',
          occupation: 'Agriculture',
          gender: 'MALE',
          dateOfBirth: '1984-05-12',
          familyHeadId: '1',
          relationshipToHead: 'SELF',
          address: 'House 42, Ward 3, Pipili, Odisha',
          status: 'ACTIVE'
        },
        {
          id: '2',
          name: 'Sunita Devi',
          email: 'sunita.d@gmail.com',
          phone: '9865432107',
          aadhaarRef: 'XXXX-XXXX-9182',
          occupation: 'Homemaker',
          gender: 'FEMALE',
          dateOfBirth: '1988-08-23',
          familyHeadId: '1',
          relationshipToHead: 'SPOUSE',
          address: 'House 42, Ward 3, Pipili, Odisha',
          status: 'ACTIVE'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCitizens();
  }, [searchName]);

  const handleOpenCreate = () => {
    setModalMode('CREATE');
    setForm({
      name: '',
      email: '',
      phone: '',
      aadhaarRef: '',
      occupation: '',
      gender: 'MALE',
      dateOfBirth: '',
      familyHeadId: '',
      relationshipToHead: 'SELF',
      address: '',
      status: 'ACTIVE'
    });
    setShowModal(true);
  };

  const handleOpenEdit = (citizen: Citizen) => {
    setModalMode('EDIT');
    setSelectedId(citizen.id);
    setForm({
      name: citizen.name,
      email: citizen.email,
      phone: citizen.phone,
      aadhaarRef: citizen.aadhaarRef,
      occupation: citizen.occupation,
      gender: citizen.gender,
      dateOfBirth: citizen.dateOfBirth,
      familyHeadId: citizen.familyHeadId || '',
      relationshipToHead: citizen.relationshipToHead || 'SELF',
      address: citizen.address,
      status: citizen.status
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (modalMode === 'CREATE') {
        await api.post('/citizens', form);
      } else {
        await api.put(`/citizens/${selectedId}`, form);
      }
      setShowModal(false);
      fetchCitizens();
    } catch (err: any) {
      alert(err.response?.data || 'Failed to submit form');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this citizen record?')) return;
    try {
      await api.delete(`/citizens/${id}`);
      fetchCitizens();
    } catch (err: any) {
      alert('Failed to delete citizen record');
    }
  };

  const filteredCitizens = citizens.filter(c => {
    if (statusFilter === 'ALL') return true;
    return c.status === statusFilter;
  });

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Citizen Records Directory</h2>
          <p className="text-sm text-slate-400">View, search, and manage registered village citizen census records.</p>
        </div>
        
        {user?.role === 'SUPER_ADMIN' && (
          <button onClick={handleOpenCreate} className="btn-primary shrink-0">
            <UserPlus className="h-4 w-4" />
            Register Citizen
          </button>
        )}
      </div>

      {/* Filters and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div className="md:col-span-3 relative">
          <Search className="absolute inset-y-0 left-3 h-5 w-5 my-auto text-slate-500" />
          <input
            type="text"
            placeholder="Search citizens by name..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="form-input pl-10"
          />
        </div>

        {/* Filter status */}
        <div className="relative">
          <Filter className="absolute inset-y-0 left-3 h-5 w-5 my-auto text-slate-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-input pl-10"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active Only</option>
            <option value="INACTIVE">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* Citizens Table */}
      <div className="glass-panel rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-800 border-t-primary"></div>
          </div>
        ) : filteredCitizens.length === 0 ? (
          <div className="p-8 text-center text-slate-500 font-semibold">
            No citizen records found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-xs">
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Aadhaar Ref</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Occupation</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {filteredCitizens.map((citizen) => (
                  <tr key={citizen.id} className="hover:bg-slate-900/30 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-slate-200">{citizen.name}</p>
                        <p className="text-xs text-slate-500">{citizen.gender} | {citizen.relationshipToHead}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-300">{citizen.aadhaarRef}</td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-slate-200">{citizen.phone}</p>
                        <p className="text-xs text-slate-500">{citizen.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-300">{citizen.occupation}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full border ${
                        citizen.status === 'ACTIVE' 
                          ? 'bg-success/10 border-success/20 text-success-light' 
                          : 'bg-danger/10 border-danger/20 text-danger-light'
                      }`}>
                        {citizen.status === 'ACTIVE' ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                        {citizen.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleOpenEdit(citizen)}
                          className="px-2 py-1 text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700 rounded hover:bg-slate-750"
                        >
                          Edit
                        </button>
                        {user?.role === 'SUPER_ADMIN' && (
                          <button 
                            onClick={() => handleDelete(citizen.id)}
                            className="px-2 py-1 text-xs font-bold bg-danger/10 text-danger-light border border-danger/20 rounded hover:bg-danger/20"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal for Create/Edit */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl animate-scale-up">
            <div className="flex h-14 items-center justify-between px-6 bg-slate-950 border-b border-slate-850">
              <h3 className="font-bold text-slate-100 flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                {modalMode === 'CREATE' ? 'Register New Citizen' : 'Update Citizen Record'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-100">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({...form, name: e.target.value})}
                    className="form-input"
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label className="form-label">Aadhaar Reference *</label>
                  <input
                    type="text"
                    required
                    value={form.aadhaarRef}
                    onChange={(e) => setForm({...form, aadhaarRef: e.target.value})}
                    className="form-input"
                    placeholder="E.g., 1234-5678-9012"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({...form, email: e.target.value})}
                    className="form-input"
                    placeholder="name@example.com"
                  />
                </div>
                <div>
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({...form, phone: e.target.value})}
                    className="form-input"
                    placeholder="E.g., +91 9876543210"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="form-label">Occupation *</label>
                  <input
                    type="text"
                    required
                    value={form.occupation}
                    onChange={(e) => setForm({...form, occupation: e.target.value})}
                    className="form-input"
                    placeholder="E.g., Farming, Tailoring"
                  />
                </div>
                <div>
                  <label className="form-label">Gender *</label>
                  <select
                    value={form.gender}
                    onChange={(e) => setForm({...form, gender: e.target.value})}
                    className="form-input"
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Date of Birth *</label>
                  <input
                    type="date"
                    required
                    value={form.dateOfBirth}
                    onChange={(e) => setForm({...form, dateOfBirth: e.target.value})}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="form-label">Family Head ID</label>
                  <input
                    type="text"
                    value={form.familyHeadId}
                    onChange={(e) => setForm({...form, familyHeadId: e.target.value})}
                    className="form-input"
                    placeholder="Head of Family ID (Optional)"
                  />
                </div>
                <div>
                  <label className="form-label">Relationship to Head</label>
                  <select
                    value={form.relationshipToHead}
                    onChange={(e) => setForm({...form, relationshipToHead: e.target.value})}
                    className="form-input"
                  >
                    <option value="SELF">Self</option>
                    <option value="SPOUSE">Spouse</option>
                    <option value="SON">Son</option>
                    <option value="DAUGHTER">Daughter</option>
                    <option value="FATHER">Father</option>
                    <option value="MOTHER">Mother</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Record Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({...form, status: e.target.value})}
                    className="form-input"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="form-label">Permanent Address *</label>
                <textarea
                  required
                  rows={3}
                  value={form.address}
                  onChange={(e) => setForm({...form, address: e.target.value})}
                  className="form-input"
                  placeholder="Enter house no, street name, ward name, village district"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Citizens;
