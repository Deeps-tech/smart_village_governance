import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Settings as SettingsIcon, Shield, User, Building, AlertCircle, CheckCircle, UserCheck } from 'lucide-react';

const Settings: React.FC = () => {
  const { user } = useAuth();
  
  // Register official (admin only)
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('VILLAGE_OFFICER');
  const [villageId, setVillageId] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleRegisterOfficial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !email || !password) {
      setError('Please fill in all required fields');
      return;
    }
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      await api.post('/auth/register', {
        username,
        email,
        password,
        role,
        villageId: villageId || 'VILL-001'
      });
      setSuccess(`Official account @${username} registered successfully!`);
      setUsername('');
      setEmail('');
      setPassword('');
      setVillageId('');
    } catch (err: any) {
      setError(err.response?.data || 'Failed to register official account.');
    } finally {
      setLoading(false);
    }
  };

  const getRoleLabel = (r: string) => {
    switch (r) {
      case 'SUPER_ADMIN': return 'Super Admin';
      case 'VILLAGE_OFFICER': return 'Village Officer';
      default: return 'Citizen User';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="glass-panel p-6 rounded-xl space-y-6 lg:col-span-1">
          <h3 className="text-md font-bold text-slate-100 flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Profile Information
          </h3>

          <div className="space-y-4">
            <div className="flex h-20 w-20 mx-auto items-center justify-center rounded-full bg-primary/10 border border-primary/20 text-primary">
              <User className="h-10 w-10 animate-pulse" />
            </div>

            <div className="text-center">
              <h4 className="font-extrabold text-slate-200 text-md">@{user?.username}</h4>
              <p className="text-xs text-slate-500 font-semibold">{user ? getRoleLabel(user.role) : ''}</p>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-850 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">User ID</span>
                <span className="text-slate-300 font-mono">{user?.id.substring(0, 8)}...</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Email</span>
                <span className="text-slate-300 font-medium">{user?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Active Village</span>
                <span className="text-slate-300 font-bold">VILL-001 (Pipili)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Administration utilities */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-xl space-y-6">
          {user?.role === 'SUPER_ADMIN' ? (
            <>
              <div>
                <h3 className="text-md font-bold text-slate-100 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-success" />
                  Administrative Portal
                </h3>
                <p className="text-xs text-slate-400 font-medium mt-1">
                  Create administrative credentials for village officers and department managers.
                </p>
              </div>

              {error && (
                <div className="flex items-center gap-2 rounded-lg bg-danger/10 border border-danger/25 p-3 text-xs text-danger font-semibold">
                  <AlertCircle className="h-4.5 w-4.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="flex items-center gap-2 rounded-lg bg-success/10 border border-success/25 p-3 text-xs text-success font-semibold">
                  <CheckCircle className="h-4.5 w-4.5 shrink-0" />
                  <span>{success}</span>
                </div>
              )}

              <form onSubmit={handleRegisterOfficial} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label text-[10px]">Username *</label>
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="form-input"
                      placeholder="Username (no spaces)"
                    />
                  </div>
                  <div>
                    <label className="form-label text-[10px]">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="form-input"
                      placeholder="officer@gramsWARAJ.gov.in"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="form-label text-[10px]">Credential Password *</label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="form-input"
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <label className="form-label text-[10px]">Official Role *</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="form-input font-bold text-xs"
                    >
                      <option value="VILLAGE_OFFICER">Village Officer</option>
                      <option value="SUPER_ADMIN">Super Admin</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="form-label text-[10px]">Village ID Location Code</label>
                  <input
                    type="text"
                    value={villageId}
                    onChange={(e) => setVillageId(e.target.value)}
                    className="form-input"
                    placeholder="VILL-001 (Pipili, default)"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary py-2.5 text-xs flex items-center justify-center gap-1.5"
                  >
                    <UserCheck className="h-4 w-4" />
                    Register Official Account
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="text-center py-10 space-y-3">
              <Shield className="h-10 w-10 text-slate-500 mx-auto" />
              <h4 className="font-extrabold text-slate-300 text-sm">Security Policy Active</h4>
              <p className="text-xs text-slate-500 font-semibold max-w-sm mx-auto leading-relaxed">
                Only the Super Admin is authorized to register official administrative credentials or modify village governance parameters.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
