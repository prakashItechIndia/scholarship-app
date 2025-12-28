import { PropsWithChildren, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DefaultButton, PrimaryButton } from '@fluentui/react';
import { HomeIcon, ArrowRightIcon } from '@/components/ui/icons';

interface NavItem {
  path: string;
  label: string;
  icon: ReactNode;
}

const navItems: NavItem[] = [
  { path: '/dashboard', label: 'Dashboard', icon: <HomeIcon /> },
  { path: '/user-login', label: 'Sign In', icon: <ArrowRightIcon /> },
];

const logo = (
  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 font-semibold text-white">
    SS
  </div>
);

export const AppShell = ({ children }: PropsWithChildren) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Simple layout replacement - you may want to create a proper layout component
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-100 p-4">
        <div className="mb-8">{logo}</div>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                void navigate(item.path);
              }}
              className={`w-full flex items-center gap-2 px-4 py-2 rounded ${
                location.pathname === item.path ||
                location.pathname.startsWith(`${item.path}/`)
                  ? 'bg-blue-100 text-blue-700'
                  : 'hover:bg-gray-200'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>
      <div className="flex-1">
        <header className="bg-white border-b p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Scholarship Management System</h1>
          <div className="flex items-center gap-2">
            <DefaultButton
              onClick={() => {
                void navigate('/dashboard');
              }}
            >
              Dashboard
            </DefaultButton>
            <PrimaryButton
              onClick={() => {
                void navigate('/user-login');
              }}
            >
              Sign In
            </PrimaryButton>
          </div>
        </header>
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
};
