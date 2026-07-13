import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Receipt, 
  Wallet, 
  Briefcase, 
  BarChart3, 
  LogOut, 
  PiggyBank, 
  ChevronLeft, 
  ChevronRight, 
  Menu, 
  X,
  Calendar,
  User
} from 'lucide-react';
import { cn } from '../lib/utils';
import { signOutUser } from '../api/auth';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Transactions', href: '/transactions', icon: Receipt },
  { name: 'Accounts', href: '/accounts', icon: Wallet },
  { name: 'Assets', href: '/assets', icon: Briefcase },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'Events', href: '/events', icon: Calendar },
];

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState<boolean>(true); // Desktop sidebar state
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false); // Mobile drawer state

  const handleLogout = async () => {
    try {
      await signOutUser();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const renderNavLinks = (closeMobile?: boolean) => {
    return navigation.map((item) => {
      const isActive = location.pathname === item.href;
      return (
        <Link
          key={item.name}
          to={item.href}
          onClick={() => {
            if (closeMobile) setIsMobileOpen(false);
          }}
          className={cn(
            'flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200',
            isActive
              ? 'bg-emerald-50 text-emerald-700 shadow-sm font-semibold'
              : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900',
            !isExpanded && "md:justify-center md:px-2" // Center icons when collapsed on desktop
          )}
          title={!isExpanded ? item.name : undefined}
        >
          <item.icon
            className={cn(
              'flex-shrink-0 h-5 w-5 transition-colors',
              isActive ? 'text-emerald-600' : 'text-zinc-400',
              (isExpanded || closeMobile) && 'mr-3'
            )}
            aria-hidden="true"
          />
          <span className={cn(
            'transition-opacity duration-200',
            !isExpanded && 'md:hidden' // Hide text on desktop only when collapsed
          )}>
            {item.name}
          </span>
        </Link>
      );
    });
  };

  return (
    <div className="flex h-screen bg-zinc-50/50 font-sans text-zinc-900 overflow-hidden">
      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/40 z-30 transition-opacity duration-300 backdrop-blur-xs"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer Sidebar */}
      <div className={cn(
        "md:hidden fixed top-0 bottom-0 left-0 w-64 bg-white z-40 shadow-2xl flex flex-col transition-transform duration-300 ease-out transform",
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Drawer Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-zinc-100 shrink-0">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-emerald-600 rounded-xl flex items-center justify-center mr-2.5">
              <PiggyBank className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">FinManage</span>
          </div>
          <button 
            onClick={() => setIsMobileOpen(false)}
            className="p-1.5 text-zinc-400 hover:text-zinc-900 rounded-lg hover:bg-zinc-50"
            title="Close Menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
          {renderNavLinks(true)}
        </nav>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-zinc-100 flex flex-col gap-2">
          <Link
            to="/profile"
            onClick={() => setIsMobileOpen(false)}
            className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-zinc-500 rounded-xl hover:bg-zinc-100 hover:text-zinc-900 transition-all duration-200"
          >
            <User className="mr-3 flex-shrink-0 h-5 w-5" aria-hidden="true" />
            Profile
          </Link>
          <button
            onClick={() => {
              setIsMobileOpen(false);
              handleLogout();
            }}
            className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-zinc-500 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all duration-200"
          >
            <LogOut className="mr-3 flex-shrink-0 h-5 w-5" aria-hidden="true" />
            Logout
          </button>
        </div>
      </div>

      {/* Desktop Collapsible Sidebar */}
      <div className={cn(
        "hidden md:flex bg-white border-r border-zinc-200 flex-col shadow-sm z-10 transition-all duration-300 relative shrink-0",
        isExpanded ? "w-64" : "w-20"
      )}>
        {/* Sidebar Header */}
        <div className="h-16 flex items-center px-5 border-b border-zinc-100 justify-between shrink-0">
          <div className="flex items-center min-w-0">
            <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center shadow-sm shadow-emerald-200 shrink-0">
              <PiggyBank className="w-5 h-5 text-white" />
            </div>
            {isExpanded && (
              <span className="text-lg font-bold tracking-tight ml-3 truncate animate-fade-in">
                FinManage
              </span>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
          {renderNavLinks()}
        </nav>

        {/* Desktop Sidebar Footer */}
        <div className="p-4 border-t border-zinc-200 shrink-0 flex flex-col gap-2">
          {/* Expand/Collapse Toggle Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center w-full px-3 py-2 text-xs font-semibold text-zinc-400 hover:text-zinc-700 rounded-xl hover:bg-zinc-50 transition-all justify-center md:justify-between mb-2"
          >
            <span className={cn(!isExpanded && "hidden")}>Collapse</span>
            {isExpanded ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>

          <Link
            to="/profile"
            className={cn(
              "flex items-center w-full px-3 py-2.5 text-sm font-medium text-zinc-500 rounded-xl hover:bg-zinc-100 hover:text-zinc-900 transition-all duration-200",
              !isExpanded && "justify-center px-2"
            )}
            title={!isExpanded ? "Profile Settings" : undefined}
          >
            <User className={cn("flex-shrink-0 h-5 w-5", isExpanded && "mr-3")} aria-hidden="true" />
            <span className={cn(
              'transition-opacity duration-200',
              !isExpanded && 'hidden'
            )}>
              Profile
            </span>
          </Link>
          <button
            onClick={handleLogout}
            className={cn(
              "flex items-center w-full px-3 py-2.5 text-sm font-medium text-zinc-500 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all duration-200",
              !isExpanded && "justify-center px-2"
            )}
            title={!isExpanded ? "Logout" : undefined}
          >
            <LogOut className={cn("flex-shrink-0 h-5 w-5", isExpanded && "mr-3")} aria-hidden="true" />
            <span className={cn(
              'transition-opacity duration-200',
              !isExpanded && 'hidden'
            )}>
              Logout
            </span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className="md:hidden h-16 bg-white border-b border-zinc-200 flex items-center justify-between px-4 z-20 shadow-sm shrink-0">
          <button 
            onClick={() => setIsMobileOpen(true)} 
            className="p-2 -ml-2 text-zinc-500 hover:text-zinc-900 rounded-xl hover:bg-zinc-100 transition-all"
            title="Open Menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex items-center">
            <div className="w-8 h-8 bg-emerald-600 rounded-xl flex items-center justify-center mr-2">
              <PiggyBank className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">FinManage</span>
          </div>

          <div className="flex items-center gap-1">
            <Link to="/profile" className="p-2 text-zinc-500 hover:text-emerald-600 rounded-lg hover:bg-emerald-50" title="Profile">
              <User className="w-5 h-5" />
            </Link>
            <button onClick={handleLogout} className="p-2 text-zinc-500 hover:text-red-600 rounded-lg hover:bg-red-50" title="Logout">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
