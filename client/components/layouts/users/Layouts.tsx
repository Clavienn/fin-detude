"use client"

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import Navbar from './NavBar';
import AppSidebar from './Sidebar';

interface LayoutsProps {
  children: React.ReactNode;
}

function Layouts({ children }: LayoutsProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleToggle = () => {
    setIsCollapsed(prev => !prev);
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Sidebar fixe */}
      <AppSidebar
        isCollapsed={isCollapsed}
        onToggle={handleToggle}
      />
      
      {/* Contenu principal avec marge pour la sidebar */}
      <div 
        className={cn(
          "flex-1 flex flex-col transition-all duration-300",
          isCollapsed ? "ml-16" : "ml-64"
        )}
      >
        {/* Navbar sticky */}
        <Navbar />
        
        {/* Zone de contenu scrollable */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Layouts;