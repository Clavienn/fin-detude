"use client"

import React, { useState, useEffect } from 'react';
import { User as UserIcon, Mail, Phone, Shield, Calendar, Loader2, Edit, Save, X, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { UserRepoAPI } from '@/infrastructures/repository/UserRepoAPI';
import type { User } from '@/domains/models/User';
import { useRouter } from 'next/navigation';
import { useDecodeToken } from '@/hooks/useDecodeToken';

const ProfilePage = () => {
  const router = useRouter();
  const { decodedToken, isExpired } = useDecodeToken();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    tel: '',
    password: '',
  });

  useEffect(() => {
    loadUser();
  }, [decodedToken]);

  const loadUser = async () => {
    try {
      setLoading(true);
      setError(null);

      // Vérifier si le token existe et n'est pas expiré
      if (!decodedToken) {
        setError("Vous devez être connecté pour accéder à votre profil");
        setLoading(false);
        return;
      }

      if (isExpired) {
        setError("Votre session a expiré. Veuillez vous reconnecter.");
        setLoading(false);
        // Optionnel: rediriger vers la page de connexion
        // router.push('/login');
        return;
      }

      // Charger les données de l'utilisateur avec l'ID du token
      const userData = await UserRepoAPI.getById(decodedToken.userId);

      setUser(userData);
      setFormData({
        name: userData.name,
        email: userData.email,
        tel: userData.tel,
        password: '',
      });
    } catch (err) {
      console.error("Erreur lors du chargement du profil:", err);
      setError("Impossible de charger les informations du profil");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const updateData: Partial<User> = {
        name: formData.name,
        email: formData.email,
        tel: formData.tel,
      };

      // N'ajouter le mot de passe que s'il a été modifié
      if (formData.password && formData.password.trim() !== '') {
        updateData.password = formData.password;
      }

      const updatedUser = await UserRepoAPI.update(user._id, updateData);
      setUser(updatedUser);
      setIsEditing(false);
      setSuccess("Profil mis à jour avec succès !");
      setFormData(prev => ({ ...prev, password: '' }));
      
      // Effacer le message de succès après 3 secondes
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Erreur lors de la mise à jour:", err);
      setError("Impossible de mettre à jour le profil");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (!user) return;
    setFormData({
      name: user.name,
      email: user.email,
      tel: user.tel,
      password: '',
    });
    setIsEditing(false);
    setError(null);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleBadgeColor = (role: string) => {
    return role === 'ADMIN' 
      ? 'bg-black text-white border-black' 
      : 'bg-gray-100 text-gray-900 border-gray-300';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-black mx-auto mb-4" />
          <p className="text-gray-600">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-gray-200">
          <CardContent className="pt-6">
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-900">
                {error}
              </AlertDescription>
            </Alert>
            <div className="flex gap-2 mt-4">
              <Button 
                onClick={() => router.back()} 
                variant="outline" 
                className="flex-1 border-gray-300"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
              {isExpired && (
                <Button 
                  onClick={() => router.push('/login')} 
                  className="flex-1 bg-black hover:bg-gray-800 text-white"
                >
                  Connexion
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header avec bouton retour */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => router.back()} 
            className="mb-4 text-gray-900 hover:bg-gray-100"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
        </div>

        {/* Carte Profil */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-200 bg-gray-50">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20 border-2 border-gray-900">
                  <AvatarFallback className="bg-black text-white text-2xl font-bold">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl text-gray-900">
                    {user.name}
                  </CardTitle>
                  <CardDescription className="text-gray-600 mt-1">
                    Informations du profil utilisateur
                  </CardDescription>
                </div>
              </div>
              <Badge 
                variant="outline" 
                className={`${getRoleBadgeColor(user.role)} px-4 py-2 text-sm font-semibold`}
              >
                <Shield className="w-4 h-4 mr-2" />
                {user.role}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            {/* Messages d'erreur et succès */}
            {error && (
              <Alert className="mb-6 border-red-200 bg-red-50">
                <AlertDescription className="text-red-900">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mb-6 border-green-200 bg-green-50">
                <AlertDescription className="text-green-900">
                  {success}
                </AlertDescription>
              </Alert>
            )}

            {/* Boutons d'action */}
            {!isEditing ? (
              <div className="mb-6">
                <Button 
                  onClick={() => setIsEditing(true)}
                  className="bg-black hover:bg-gray-800 text-white"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Modifier le profil
                </Button>
              </div>
            ) : (
              <div className="flex gap-2 mb-6">
                <Button 
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-black hover:bg-gray-800 text-white"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Enregistrer
                    </>
                  )}
                </Button>
                <Button 
                  onClick={handleCancel}
                  variant="outline"
                  disabled={saving}
                  className="border-gray-300 text-gray-900 hover:bg-gray-100"
                >
                  <X className="w-4 h-4 mr-2" />
                  Annuler
                </Button>
              </div>
            )}

            <Separator className="mb-6 bg-gray-200" />

            {/* Formulaire / Informations */}
            <div className="space-y-6">
              {/* Nom */}
              <div className="space-y-2">
                <Label className="text-gray-900 flex items-center gap-2">
                  <UserIcon className="w-4 h-4" />
                  Nom complet
                </Label>
                {isEditing ? (
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Votre nom complet"
                    className="border-gray-300 focus:border-black focus:ring-black"
                  />
                ) : (
                  <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
                    <p className="text-gray-900 font-medium">{user.name}</p>
                  </div>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label className="text-gray-900 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Adresse email
                </Label>
                {isEditing ? (
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="votre@email.com"
                    className="border-gray-300 focus:border-black focus:ring-black"
                  />
                ) : (
                  <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
                    <p className="text-gray-900 font-medium">{user.email}</p>
                  </div>
                )}
              </div>

              {/* Téléphone */}
              <div className="space-y-2">
                <Label className="text-gray-900 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Numéro de téléphone
                </Label>
                {isEditing ? (
                  <Input
                    name="tel"
                    type="tel"
                    value={formData.tel}
                    onChange={handleInputChange}
                    placeholder="+261 XX XX XXX XX"
                    className="border-gray-300 focus:border-black focus:ring-black"
                  />
                ) : (
                  <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
                    <p className="text-gray-900 font-medium">{user.tel}</p>
                  </div>
                )}
              </div>

              {/* Mot de passe (uniquement en édition) */}
              {isEditing && (
                <div className="space-y-2">
                  <Label className="text-gray-900">
                    Nouveau mot de passe (optionnel)
                  </Label>
                  <div className="relative">
                    <Input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Laissez vide pour ne pas modifier"
                      className="border-gray-300 focus:border-black focus:ring-black pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 text-gray-600" />
                      ) : (
                        <Eye className="w-4 h-4 text-gray-600" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Minimum 6 caractères recommandés
                  </p>
                </div>
              )}

              <Separator className="bg-gray-200" />

              {/* Informations système */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                  Informations système
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-4 h-4 text-gray-600" />
                      <span className="text-xs text-gray-600 uppercase">Membre depuis</span>
                    </div>
                    <p className="text-gray-900 font-medium">
                      {user.createdAt 
                        ? new Date(user.createdAt).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })
                        : 'N/A'
                      }
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
                    <div className="flex items-center gap-2 mb-1">
                      <Shield className="w-4 h-4 text-gray-600" />
                      <span className="text-xs text-gray-600 uppercase">Rôle</span>
                    </div>
                    <p className="text-gray-900 font-medium">
                      {user.role === 'ADMIN' ? 'Administrateur' : 'Utilisateur'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Informations du token (debug - optionnel) */}
              {decodedToken && (
                <div className="mt-4 p-4 bg-gray-50 rounded-md border border-gray-200">
                  <p className="text-xs text-gray-600 mb-2">Session active</p>
                  <div className="space-y-1 text-xs text-gray-500">
                    <p>ID Utilisateur: {decodedToken.userId}</p>
                    <p>Rôle: {decodedToken.role}</p>
                    <p>Expiration: {new Date(decodedToken.exp * 1000).toLocaleString('fr-FR')}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;