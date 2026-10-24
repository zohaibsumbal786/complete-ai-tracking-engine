import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  FileText, 
  Calendar, 
  BarChart3, 
  LogOut,
  Search
} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Jobs', href: '/jobs', icon: Briefcase },
    { name: 'Candidates', href: '/candidates', icon: Users },
    { name: 'Applications', href: '/applications', icon: FileText },
    { name: 'Interviews', href: '/interviews', icon: Calendar },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-secondary-800 text-white">
        <div className="flex flex-col h-full">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-primary">RecruitAI</h1>
            <p className="text-sm text-gray-400 mt-1">Recruitment Pipeline</p>
          </div>

          <nav className="flex-1 px-4 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-gray-300 hover:bg-secondary-700'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-secondary-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-gray-400">{user?.email}</p>
              </div>
              <button
                onClick={logout}
                className="p-2 hover:bg-secondary-700 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="ml-64">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="px-8 py-4">
            <div className="flex items-center gap-4">
              <div className="flex-1 max-w-2xl">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search candidates, jobs..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
