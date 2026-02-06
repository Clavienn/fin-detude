"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  Settings,
  Menu,
  Search,
  Workflow,
  FileJson,
  Settings2,
  LogOut,
  ChartBarIncreasing,
  User,
  View,
  MoveLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useDecodeToken } from "@/hooks/useDecodeToken";
import { UserRepoAPI } from "@/infrastructures/repository/UserRepoAPI";
import type { User } from "@/domains/models/User";

interface SidebarProps {
  className?: string;
  isCollapsed?: boolean;
  onToggle?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  className,
  isCollapsed = false,
  onToggle,
}) => {
  const router = useRouter();
  const { decodedToken, isExpired } = useDecodeToken();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!decodedToken || isExpired) {
        setLoading(false);
        return;
      }

      try {
        const userData = await UserRepoAPI.getById(decodedToken.userId);
        setUser(userData);
      } catch (error) {
        console.error("Erreur lors de la récupération des données utilisateur:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [decodedToken, isExpired]);

  const menuItems = [
    { 
      icon: LayoutDashboard, 
      label: "Tableau de bord", 
      href: "/tableau-de-bord" 
    },
    { 
      icon: MoveLeft, 
      label: "Page d'accueil", 
      href: "/" 
    },
    { 
      icon: ChartBarIncreasing, 
      label: "Visualisation Pipelines ETL", 
      href: "/tableau-de-bord/pipelines" 
    },
    { 
      icon: Workflow, 
      label: "My workflows", 
      href: "/tableau-de-bord/workflows" 
    },
    { 
      icon: FileJson, 
      label: "Logs & Historique", 
      href: "/tableau-de-bord/logs" 
    },
  ];

  const bottomMenuItems = [
    { 
      icon: Settings, 
      label: "Configuration", 
      href: "/tableau-de-bord/configuration" 
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token-datanova");
    router.push("/");
  };

  // Fonction pour obtenir les initiales de l'utilisateur
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen flex flex-col bg-white border-r border-gray-200 transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
        className
      )}
    >
      {/* Header avec logo */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-black">DATANOVA</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="ml-auto hover:bg-gray-100"
        >
          <Menu className="h-4 w-4 text-gray-600" />
        </Button>
      </div>

      {/* Barre de recherche */}
      {!isCollapsed && (
        <div className="p-4 flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-black placeholder:text-gray-400"
            />
          </div>
        </div>
      )}

      {/* Menu principal */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full px-3">
          <div className="space-y-1 py-2">
            {menuItems.map((item, index) => (
              <Button
                key={index}
                onClick={() => router.push(item.href)}
                variant="ghost"
                className={cn(
                  "w-full justify-start h-10 text-gray-700 hover:bg-blue-50 hover:text-blue-600",
                  isCollapsed ? "px-2" : "px-3"
                )}
              >
                <item.icon className="h-4 w-4" />
                {!isCollapsed && <span className="ml-3">{item.label}</span>}
              </Button>
            ))}
          </div>

          <Separator className="my-4 bg-gray-200" />

          {/* Menu du bas */}
          <div className="space-y-1 py-2">
            {bottomMenuItems.map((item, index) => (
              <Button
                key={index}
                variant="ghost"
                className={cn(
                  "w-full justify-start h-10 text-gray-700 hover:bg-blue-50 hover:text-blue-600",
                  isCollapsed ? "px-2" : "px-3"
                )}
                onClick={() => router.push(item.href)}
              >
                <item.icon className="h-4 w-4" />
                {!isCollapsed && <span className="ml-3">{item.label}</span>}
              </Button>
            ))}
            
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start h-10 text-red-600 hover:bg-red-50 hover:text-red-700",
                isCollapsed ? "px-2" : "px-3"
              )}
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              {!isCollapsed && <span className="ml-3">Déconnexion</span>}
            </Button>
          </div>
        </ScrollArea>
      </div>

      {/* User info en bas */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-200 flex-shrink-0">
          {loading ? (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-300 rounded-full animate-pulse"></div>
              <div className="flex-1 min-w-0 space-y-2">
                <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
                <div className="h-3 bg-gray-300 rounded w-2/3 animate-pulse"></div>
              </div>
            </div>
          ) : user ? (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                {getInitials(user.name)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-black truncate">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user.email}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-white font-semibold">
                ?
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-black truncate">
                  Non connecté
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </aside>
  );
};

export default Sidebar;