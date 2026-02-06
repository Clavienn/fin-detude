"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff } from 'lucide-react';
import { UserRepoAPI } from '@/infrastructures/repository/UserRepoAPI';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isLoading, setIsLoading] = useState(false);




  const handleLogin = async () => {
  setIsLoading(true);
  setMessage({ type: '', text: '' });

  if (!email || !password) {
    setMessage({ type: 'error', text: 'Veuillez remplir tous les champs' });
    setIsLoading(false);
    return;
  }

  if (!email.includes('@')) {
    setMessage({ type: 'error', text: 'Email invalide' });
    setIsLoading(false);
    return;
  }

  try {
    const { token } = await UserRepoAPI.login(email, password);
    localStorage.setItem('token-datanova', token);
    
    setMessage({ type: 'success', text: 'Connexion réussie ! Redirection...' });
    
    // Redirection après 1 seconde
    setTimeout(() => {
      window.location.href = '/tableau-de-bord';
    }, 1000);
  } catch (error: any) {
    setMessage({ 
      type: 'error', 
      text: error.response?.data?.message || 'Email ou mot de passe incorrect' 
    });
    setIsLoading(false);
  }
};

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            Connexion
          </CardTitle>
          <CardDescription className="text-center">
            Accédez à votre compte
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {message.text && (
            <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="exemple@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <div className="text-right">
              <button
                type="button"
                onClick={() => setMessage({ type: 'info', text: 'Email de réinitialisation envoyé' })}
                className="text-sm text-violet-600 hover:text-violet-800 hover:underline transition-colors"
              >
                Mot de passe oublié ?
              </button>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <Button
            onClick={handleLogin}
            className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold shadow-lg"
            disabled={isLoading}
          >
            {isLoading ? 'Connexion...' : 'Se connecter'}
          </Button>

          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">OU</span>
            </div>
          </div>

          <div className="text-center text-sm text-gray-600">
            Pas encore de compte ?{' '}
            <a
              href="/auth/register"
              className="text-violet-600 hover:text-violet-800 font-semibold hover:underline transition-colors"
            >
              Créer un compte
            </a>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}