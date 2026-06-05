import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, Users, AlertTriangle, Award, 
  Construction, CircleDollarSign, Megaphone, Settings, 
  LogOut, Menu, X, User as UserIcon, Building
} from 'lucide-react';

interface SidebarItem {
  name: string;
  path: string;
  icon: React.ComponentType<any>;
  roles: string[];
}

const sidebarItems: SidebarItem[] = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['SUPER_ADMIN', 'VILLAGE_OFFICER', 'CITIZEN'] },
  { name: 'Citizens', path: '/citizens', icon: Users, roles: ['SUPER_ADMIN', 'VILLAGE_OFFICER'] },
  { name: 'Grievances', path: '/grievances', icon: AlertTriangle, roles: ['SUPER_ADMIN', 'VILLAGE_OFFICER', 'CITIZEN'] },
  { name: 'Welfare Schemes', path: '/schemes', icon: Award, roles: ['SUPER_ADMIN', 'VILLAGE_OFFICER', 'CITIZEN'] },
  { name: 'Infrastructure', path: '/infrastructure', icon: Construction, roles: ['SUPER_ADMIN', 'VILLAGE_OFFICER', 'CITIZEN'] },
  { name: 'Budget & Reports', path: '/budget', icon: CircleDollarSign, roles: ['SUPER_ADMIN', 'VILLAGE_OFFICER'] },
  { name: 'Announcements', path: '/announcements', icon: Megaphone, roles: ['SUPER_ADMIN', 'VILLAGE_OFFICER', 'CITIZEN'] },
  { name: 'Settings', path: '/settings', icon: Settings, roles: ['SUPER_ADMIN', 'VILLAGE_OFFICER', 'CITIZEN'] },
];

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filteredItems = sidebarItems.filter(item => user && item.roles.includes(user.role));

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN': return 'Super Admin';
      case 'VILLAGE_OFFICER': return 'Village Officer';
      case 'CITIZEN': return 'Citizen User';
      default: return role;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex md:w-64 md:flex-col bg-slate-900 border-r border-slate-800 glass-panel">
        <div className="flex h-16 items-center px-6 border-b border-slate-800 gap-2">
          <Building className="h-6 w-6 text-primary" />
          <span className="font-extrabold text-lg text-slate-100 tracking-wide">GramSwaraj</span>
        </div>
        
        <div className="flex-1 flex flex-col justify-between overflow-y-auto px-4 py-6">
          <nav className="space-y-1">
            {filteredItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    isActive 
                      ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="pt-6 border-t border-slate-800">
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-800/40 border border-slate-800/50 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 border border-primary/30">
                <UserIcon className="h-5 w-5 text-primary-light" />
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-slate-200 truncate">{user?.username}</p>
                <p className="text-xs text-slate-500 font-semibold">{user ? getRoleLabel(user.role) : ''}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-danger hover:bg-danger/10 transition-all duration-200"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar (Drawer Overlay) */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden bg-slate-950/80 backdrop-blur-sm">
          <div className="w-64 bg-slate-900 border-r border-slate-850 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <Building className="h-6 w-6 text-primary" />
                  <span className="font-extrabold text-lg text-slate-100">GramSwaraj</span>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-slate-100">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <nav className="space-y-1">
                {filteredItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                        isActive 
                          ? 'bg-primary text-white shadow-lg' 
                          : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="pt-6 border-t border-slate-800">
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-800/40 border border-slate-800/50 mb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20">
                  <UserIcon className="h-5 w-5 text-primary-light" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-200">{user?.username}</p>
                  <p className="text-xs text-slate-500 font-semibold">{user ? getRoleLabel(user.role) : ''}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-danger hover:bg-danger/10 transition-all duration-200"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Header */}
        <header className="flex h-16 items-center justify-between px-6 bg-slate-900 border-b border-slate-850">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)} 
              className="md:hidden text-slate-400 hover:text-slate-100"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-bold text-slate-100">
              {location.pathname === '/dashboard' && 'Governance Dashboard'}
              {location.pathname === '/citizens' && 'Citizen Directory'}
              {location.pathname === '/grievances' && 'Grievance Redressal Portal'}
              {location.pathname === '/schemes' && 'Welfare Schemes Portal'}
              {location.pathname === '/infrastructure' && 'Village Assets & Infrastructure'}
              {location.pathname === '/budget' && 'Budget Monitoring & Reports'}
              {location.pathname === '/announcements' && 'Village Bulletin Board'}
              {location.pathname === '/settings' && 'User Settings'}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex text-right flex-col">
              <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20 select-none">
                {user ? getRoleLabel(user.role) : ''}
              </span>
            </div>
          </div>
        </header>

        {/* Dynamic Route Content */}
        <main className="flex-1 overflow-y-auto px-6 py-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
