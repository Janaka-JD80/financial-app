import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Receipt, Wallet, PiggyBank, Briefcase, BarChart3 } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Transactions', href: '/transactions', icon: Receipt },
  { name: 'Accounts', href: '/accounts', icon: Wallet },
  { name: 'Assets', href: '/assets', icon: Briefcase },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
];

export function Layout() {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-zinc-50/50 font-sans text-zinc-900">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-64 bg-white border-r border-zinc-200 flex-col shadow-sm z-10">
        <div className="h-16 flex items-center px-6 border-b border-zinc-100">
          <div className="w-8 h-8 bg-emerald-600 rounded-xl flex items-center justify-center mr-3 shadow-sm shadow-emerald-200">
            <PiggyBank className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">FinManage</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200',
                  isActive
                    ? 'bg-emerald-50 text-emerald-700 shadow-sm'
                    : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900'
                )}
              >
                <item.icon
                  className={cn(
                    'mr-3 flex-shrink-0 h-5 w-5 transition-colors',
                    isActive ? 'text-emerald-600' : 'text-zinc-400'
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden pb-16 md:pb-0">
        {/* Mobile Header */}
        <div className="md:hidden h-16 bg-white border-b border-zinc-200 flex items-center px-4 z-20 shadow-sm shrink-0">
          <div className="w-8 h-8 bg-emerald-600 rounded-xl flex items-center justify-center mr-3">
            <PiggyBank className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">FinManage</span>
        </div>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-zinc-200 flex items-center justify-around px-2 z-20 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors',
                isActive ? 'text-emerald-600' : 'text-zinc-400 hover:text-zinc-600'
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive && "fill-emerald-50")} />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
