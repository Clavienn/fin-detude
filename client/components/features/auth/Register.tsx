"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { UserRepoAPI } from '@/infrastructures/repository/UserRepoAPI';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async () => {
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    // Validations
    if (!name || !email || !phone || !password) {
      setMessage({ type: 'error', text: 'Veuillez remplir tous les champs' });
      setIsLoading(false);
      return;
    }

    if (!email.includes('@')) {
      setMessage({ type: 'error', text: 'Email invalide' });
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setMessage({ type: 'error', text: 'Le mot de passe doit contenir au moins 6 caractères' });
      setIsLoading(false);
      return;
    }

    try {
      const user = await UserRepoAPI.register({ 
        name, 
        email, 
        tel: phone, 
        password 
      });
      
      console.log('✅ Inscription réussie:', user);
      
      setMessage({ type: 'success', text: 'Inscription réussie ! Redirection...' });
      
      // Redirection après 2 secondes
      setTimeout(() => {
        window.location.href = '/auth/login';
      }, 2000);
      
    } catch (error: any) {
      console.error('❌ Erreur inscription:', error);
      
      const errorMessage = error.response?.data?.message 
        || error.message 
        || 'Erreur lors de l\'inscription';
      
      setMessage({ 
        type: 'error', 
        text: errorMessage
      });
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSignup();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-purple-50">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Inscription
          </CardTitle>
          <CardDescription className="text-center">
            Créez votre nouveau compte
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {message.text && (
            <Alert variant={message.type === 'error' ? 'destructive' : 'default'} 
                   className={message.type === 'success' ? 'bg-green-50 text-green-800 border-green-200' : ''}>
              {message.type === 'success' && (
                <CheckCircle2 className="h-4 w-4 inline mr-2" />
              )}
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Nom complet</Label>
            <Input
              id="name"
              type="text"
              placeholder="Jean Dupont"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
          </div>

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
            <Label htmlFor="phone">Téléphone</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+261 34 00 000 00"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
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
                disabled={isLoading}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <p className="text-xs text-gray-500">Minimum 6 caractères</p>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <Button
            onClick={handleSignup}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg"
            disabled={isLoading}
          >
            {isLoading ? 'Création en cours...' : "S'inscrire"}
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
            Déjà un compte ?{' '}
            <a
              href="/auth/login"
              className="text-blue-600 hover:text-blue-800 font-semibold hover:underline transition-colors"
            >
              Se connecter
            </a>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}