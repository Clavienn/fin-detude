"use client"

import React, { useState, useEffect } from 'react';
import { Menu, X, User, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Header: React.FC = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userName, setUserName] = useState('Utilisateur');

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const token = localStorage.getItem('token-datanova');
    setIsAuthenticated(!!token);

    // Optionnel: récupérer le nom de l'utilisateur depuis localStorage ou JWT
    const storedUser = localStorage.getItem('user-datanova');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserName(user.name || 'Utilisateur');
      } catch (e) {
        console.error('Erreur parsing user:', e);
      }
    }
  }, []);

  // Gestion de la déconnexion
  const handleLogout = () => {
    localStorage.removeItem('token-datanova');
    localStorage.removeItem('user-datanova');
    setIsAuthenticated(false);
    router.push('/');
  };

  // Navigation items
  const navItems = [
    { href: '/', label: 'Accueil' },
    { href: '/apropos', label: 'À propos' },
    { href: '/tarifs', label: 'Tarifs' },
    { href: '#contact', label: 'Contact' },
  ];

  return (
    <header className="fixed w-full z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition">
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
              DATANOVA
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-2 text-sm font-medium rounded-md transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA / User Menu */}
          <div className="hidden lg:flex items-center space-x-4">
            {!isAuthenticated ? (
              <>
                <Button 
                  size="lg" 
                  onClick={() => router.push("/auth/login")} 
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                >
                  Se connecter
                </Button>
              </>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span className="hidden xl:inline">{userName}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push('/tableau-de-bord')}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Tableau de bord</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/tableau-de-bord/profil')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profil</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Déconnexion</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle className="text-left">
                  <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
                    DATANOVA
                  </span>
                </SheetTitle>
              </SheetHeader>
              
              <div className="flex flex-col space-y-4 mt-8">
                {/* User Info si connecté */}
                {isAuthenticated && (
                  <div className="p-4 bg-accent rounded-lg mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold">{userName}</p>
                        <p className="text-xs text-muted-foreground">Compte actif</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Links */}
                <nav className="flex flex-col space-y-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="px-4 py-3 rounded-md hover:bg-accent transition-colors text-base font-medium"
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>

                {/* Séparateur */}
                <div className="border-t my-4" />

                {/* Actions selon l'état d'auth */}
                {!isAuthenticated ? (
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        setIsMenuOpen(false);
                        router.push('/demo');
                      }}
                    >
                      Démo
                    </Button>
                    <Button 
                      className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                      onClick={() => {
                        setIsMenuOpen(false);
                        router.push('/auth/login');
                      }}
                    >
                      Se connecter
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => {
                        setIsMenuOpen(false);
                        router.push('/dashboard');
                      }}
                    >
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Tableau de bord
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => {
                        setIsMenuOpen(false);
                        router.push('/profil');
                      }}
                    >
                      <User className="mr-2 h-4 w-4" />
                      Profil
                    </Button>
                    <Button 
                      variant="destructive" 
                      className="w-full justify-start"
                      onClick={() => {
                        setIsMenuOpen(false);
                        handleLogout();
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Déconnexion
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;