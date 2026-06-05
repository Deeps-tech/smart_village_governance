import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Construction, CircleDot, Activity, Info, 
  Plus, Calendar, IndianRupee, MapPin, 
  Check, X, Edit3, ShieldAlert 
} from 'lucide-react';

interface Infrastructure {
  id: string;
  assetName: string;
  assetType: string; // ROADS, STREET_LIGHTS, WATER_TANKS, DRAINAGE, SCHOOLS
  location: string;
  status: string; // OPERATIONAL, UNDER_MAINTENANCE, NEEDS_REPAIR
  lastInspected: string;
  maintenanceCost: number;
}

const ASSET_TYPES = ['ROADS', 'STREET_LIGHTS', 'WATER_TANKS', 'DRAINAGE', 'SCHOOLS'];

const Infrastructure: React.FC = () => {
  const { user } = useAuth();
  const [assets, setAssets] = useState<Infrastructure[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  
  const [selectedAsset, setSelectedAsset] = useState<Infrastructure | null>(null);

  // Form: Add Asset
  const [addForm, setAddForm] = useState({
    assetName: '',
    assetType: 'ROADS',
    location: '',
    status: 'OPERATIONAL',
    maintenanceCost: 0,
  });

  // Form: Update Status
  const [updateStatus, setUpdateStatus] = useState('OPERATIONAL');
  const [updateCost, setUpdateCost] = useState(0);
  const [updating, setUpdating] = useState(false);

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const response = await api.get('/infrastructure');
      setAssets(response.data);
    } catch (err: any) {
      setError('Failed to fetch infrastructure records');
      // Hackathon fallback
      setAssets([
        {
          id: 'inf1',
          assetName: 'Main Bazar Road (Concrete)',
          assetType: 'ROADS',
          location: 'Bazar Chowk to High School',
          status: 'OPERATIONAL',
          lastInspected: '2026-05-15',
          maintenanceCost: 150000
        },
        {
          id: 'inf2',
          assetName: 'Primary School Water Filter',
          assetType: 'WATER_TANKS',
          location: 'Govt. Primary School Compound',
          status: 'UNDER_MAINTENANCE',
          lastInspected: '2026-06-01',
          maintenanceCost: 8500
        },
        {
          id: 'inf3',
          assetName: 'Village Ward 3 Street Lights Grid',
          assetType: 'STREET_LIGHTS',
          location: 'Ward 3 lanes (12 units)',
          status: 'NEEDS_REPAIR',
          lastInspected: '2026-05-20',
          maintenanceCost: 12000
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/infrastructure', addForm);
      setShowAddModal(false);
      setAddForm({ assetName: '', assetType: 'ROADS', location: '', status: 'OPERATIONAL', maintenanceCost: 0 });
      fetchAssets();
    } catch (err: any) {
      alert('Failed to add infrastructure asset');
    }
  };

  const handleStatusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAsset) return;
    setUpdating(true);
    try {
      await api.put(`/infrastructure/${selectedAsset.id}/status`, {
        status: updateStatus,
        maintenanceCost: updateCost
      });
      setShowStatusModal(false);
      setSelectedAsset(null);
      fetchAssets();
    } catch (err: any) {
      alert('Failed to update asset status');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OPERATIONAL': return 'bg-success/10 border-success/20 text-success-light';
      case 'UNDER_MAINTENANCE': return 'bg-warning/10 border-warning/20 text-warning-light';
      case 'NEEDS_REPAIR': return 'bg-danger/10 border-danger/20 text-danger-light';
      default: return 'bg-slate-800 text-slate-450';
    }
  };

  const getAssetTypeLabel = (type: string) => {
    return type.replace('_', ' ');
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
          <h2 className="text-xl font-bold text-slate-100">Village Infrastructure Assets</h2>
          <p className="text-sm text-slate-400">Track structural conditions, inspection logs, and repair expenditures.</p>
        </div>

        {user?.role !== 'CITIZEN' && (
          <button onClick={() => setShowAddModal(true)} className="btn-primary shrink-0">
            <Plus className="h-4 w-4" />
            Add Asset
          </button>
        )}
      </div>

      {/* Asset Cards Grid */}
      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-800 border-t-primary"></div>
        </div>
      ) : assets.length === 0 ? (
        <div className="glass-panel p-8 text-center text-slate-500 font-semibold rounded-xl">
          No village assets registered in system.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {assets.map((asset) => (
            <div key={asset.id} className="glass-card p-6 rounded-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-900 border border-slate-850 px-2 py-0.5 rounded">
                    {getAssetTypeLabel(asset.assetType)}
                  </span>
                  <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(asset.status)}`}>
                    <CircleDot className="h-2 w-2 animate-pulse" />
                    {asset.status.replace('_', ' ')}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-200 mt-4 truncate">{asset.assetName}</h3>
                
                <div className="mt-4 space-y-2 text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-slate-500" />
                    <span className="truncate">{asset.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-slate-500" />
                    <span>Last Inspected: {new Date(asset.lastInspected).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <IndianRupee className="h-4 w-4 text-slate-500" />
                    <span>Accumulated Maintenance: <b>{formatter.format(asset.maintenanceCost)}</b></span>
                  </div>
                </div>
              </div>

              {user?.role !== 'CITIZEN' && (
                <div className="mt-6 pt-4 border-t border-slate-850">
                  <button
                    onClick={() => {
                      setSelectedAsset(asset);
                      setUpdateStatus(asset.status);
                      setUpdateCost(asset.maintenanceCost);
                      setShowStatusModal(true);
                    }}
                    className="btn-secondary w-full py-2 text-xs justify-center"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    Log Condition / Inspection
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal: Add Asset */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl animate-scale-up">
            <div className="flex h-14 items-center justify-between px-6 bg-slate-950 border-b border-slate-850">
              <h3 className="font-bold text-slate-100 flex items-center gap-2">
                <Construction className="h-5 w-5 text-primary" />
                Add Infrastructure Asset
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-100">
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
              <div>
                <label className="form-label">Asset Name *</label>
                <input
                  type="text"
                  required
                  value={addForm.assetName}
                  onChange={(e) => setAddForm({...addForm, assetName: e.target.value})}
                  className="form-input"
                  placeholder="E.g., High School Drinking Well"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Asset Type *</label>
                  <select
                    value={addForm.assetType}
                    onChange={(e) => setAddForm({...addForm, assetType: e.target.value})}
                    className="form-input"
                  >
                    {ASSET_TYPES.map(t => <option key={t} value={t}>{getAssetTypeLabel(t)}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Initial Status *</label>
                  <select
                    value={addForm.status}
                    onChange={(e) => setAddForm({...addForm, status: e.target.value})}
                    className="form-input"
                  >
                    <option value="OPERATIONAL">Operational</option>
                    <option value="UNDER_MAINTENANCE">Under Maintenance</option>
                    <option value="NEEDS_REPAIR">Needs Repair</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="form-label">Asset Location *</label>
                <input
                  type="text"
                  required
                  value={addForm.location}
                  onChange={(e) => setAddForm({...addForm, location: e.target.value})}
                  className="form-input"
                  placeholder="E.g., Ward 4, Panchayat Compound"
                />
              </div>

              <div>
                <label className="form-label">Accumulated Maintenance Cost (INR)</label>
                <input
                  type="number"
                  value={addForm.maintenanceCost}
                  onChange={(e) => setAddForm({...addForm, maintenanceCost: parseFloat(e.target.value) || 0})}
                  className="form-input"
                  placeholder="E.g., 5000"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Add Asset</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Log Inspection Status */}
      {showStatusModal && selectedAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl animate-scale-up">
            <div className="flex h-14 items-center justify-between px-6 bg-slate-950 border-b border-slate-850">
              <h3 className="font-bold text-slate-100 flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Log Inspection Status
              </h3>
              <button onClick={() => { setShowStatusModal(false); setSelectedAsset(null); }} className="text-slate-400 hover:text-slate-100">
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleStatusSubmit} className="p-6 space-y-4">
              <p className="text-xs text-slate-400 font-semibold mb-2">Updating: <b className="text-slate-200">{selectedAsset.assetName}</b></p>
              
              <div>
                <label className="form-label">Update Status *</label>
                <select
                  value={updateStatus}
                  onChange={(e) => setUpdateStatus(e.target.value)}
                  className="form-input"
                >
                  <option value="OPERATIONAL">Operational</option>
                  <option value="UNDER_MAINTENANCE">Under Maintenance</option>
                  <option value="NEEDS_REPAIR">Needs Repair</option>
                </select>
              </div>

              <div>
                <label className="form-label">Cumulative Maintenance Cost (INR) *</label>
                <input
                  type="number"
                  required
                  value={updateCost}
                  onChange={(e) => setUpdateCost(parseFloat(e.target.value) || 0)}
                  className="form-input"
                  placeholder="Enter maintenance amount"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button 
                  type="button" 
                  onClick={() => { setShowStatusModal(false); setSelectedAsset(null); }} 
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" disabled={updating} className="btn-primary">
                  {updating ? 'Updating...' : 'Log Inspection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Infrastructure;
