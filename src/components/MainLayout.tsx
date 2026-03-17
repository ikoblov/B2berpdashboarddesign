import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { useSidebar } from '../contexts/SidebarContext';
import { cn } from '../lib/utils';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { isCollapsed } = useSidebar();

  return (
    <>
      <Sidebar />
      <main 
        className={cn(
          "mt-16 transition-all duration-300 ease-in-out",
          isCollapsed ? "ml-16" : "ml-64"
        )}
      >
        {children}
      </main>
    </>
  );
}
