"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Settings, User as UserIcon, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDecodeToken } from "@/hooks/useDecodeToken";
import { UserRepoAPI } from "@/infrastructures/repository/UserRepoAPI";
import type { User } from "@/domains/models/User";

interface NavbarProps {
  className?: string;
  title?: string;
}

const Navbar: React.FC<NavbarProps> = ({
  className,
  title = "Espace Client",
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

  const handleLogout = () => {
    localStorage.removeItem("token-datanova");
    router.push("/");
  };

  const handleProfile = () => {
    router.push("/tableau-de-bord/profil");
  };

  const handleSettings = () => {
    router.push("/tableau-de-bord/settings");
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
    <header
      className={cn(
        "sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className
      )}
    >
      <div className="flex h-16 items-center justify-between px-4">
        {/* Left */}
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold">{title}</h1>
        </div>

        {/* Right */}
        <div className="flex items-center space-x-2">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                {/* Badge optionnel pour le nombre de notifications */}
                {/* <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" /> */}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 bg-white">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <div className="text-sm text-muted-foreground">
                  Aucune notification
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full p-0"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src="/avatars/default.png"
                    alt={user?.name || "User"}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                    {loading ? "..." : user ? getInitials(user.name) : "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 bg-white"
              align="end"
              forceMount
            >
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  {loading ? (
                    <p className="text-sm text-muted-foreground">Chargement...</p>
                  ) : user ? (
                    <>
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">Non connecté</p>
                  )}
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={handleProfile}
                className="cursor-pointer hover:bg-gray-100"
              >
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Mon Profil</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={handleSettings}
                className="cursor-pointer hover:bg-gray-100"
              >
                <Settings className="mr-2 h-4 w-4" />
                <span>Paramètres</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 hover:bg-red-50"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Déconnexion</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Navbar;