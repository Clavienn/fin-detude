"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';

// Types
interface ILog {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  workflowId: {
    _id: string;
    name: string;
  };
  action: string;
  createdAt: string;
  updatedAt: string;
}

// Données de démonstration
const mockLogs: ILog[] = [
  {
    _id: '1',
    userId: { _id: 'u1', name: 'Jean Dupont', email: 'jean.dupont@example.com' },
    workflowId: { _id: 'w1', name: 'Workflow de validation' },
    action: 'workflow_started',
    createdAt: '2026-01-13T10:30:00Z',
    updatedAt: '2026-01-13T10:30:00Z'
  },
  {
    _id: '2',
    userId: { _id: 'u2', name: 'Marie Martin', email: 'marie.martin@example.com' },
    workflowId: { _id: 'w2', name: 'Workflow de traitement' },
    action: 'workflow_completed',
    createdAt: '2026-01-13T09:15:00Z',
    updatedAt: '2026-01-13T09:15:00Z'
  },
  {
    _id: '3',
    userId: { _id: 'u3', name: 'Pierre Dubois', email: 'pierre.dubois@example.com' },
    workflowId: { _id: 'w3', name: 'Workflow d\'envoi email' },
    action: 'workflow_failed',
    createdAt: '2026-01-13T08:45:00Z',
    updatedAt: '2026-01-13T08:45:00Z'
  },
  {
    _id: '4',
    userId: { _id: 'u1', name: 'Jean Dupont', email: 'jean.dupont@example.com' },
    workflowId: { _id: 'w4', name: 'Workflow de synchronisation' },
    action: 'workflow_paused',
    createdAt: '2026-01-12T16:20:00Z',
    updatedAt: '2026-01-12T16:20:00Z'
  },
  {
    _id: '5',
    userId: { _id: 'u4', name: 'Sophie Laurent', email: 'sophie.laurent@example.com' },
    workflowId: { _id: 'w1', name: 'Workflow de validation' },
    action: 'workflow_started',
    createdAt: '2026-01-12T14:10:00Z',
    updatedAt: '2026-01-12T14:10:00Z'
  },
  {
    _id: '6',
    userId: { _id: 'u2', name: 'Marie Martin', email: 'marie.martin@example.com' },
    workflowId: { _id: 'w5', name: 'Workflow d\'importation' },
    action: 'workflow_completed',
    createdAt: '2026-01-12T11:30:00Z',
    updatedAt: '2026-01-12T11:30:00Z'
  }
];

const LogsPage = () => {
  const [logs] = useState<ILog[]>(mockLogs);
  const [searchTerm, setSearchTerm] = useState('');

  // Fonction pour formater la date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  // Fonction pour obtenir le style du badge selon l'action
  const getActionBadgeVariant = (action: string) => {
    const variants: Record<string, string> = {
      workflow_started: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
      workflow_completed: 'bg-green-100 text-green-800 hover:bg-green-100',
      workflow_failed: 'bg-red-100 text-red-800 hover:bg-red-100',
      workflow_paused: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
    };
    return variants[action] || 'bg-gray-100 text-gray-800 hover:bg-gray-100';
  };

  // Fonction pour formater le nom de l'action
  const formatAction = (action: string) => {
    return action.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Filtrage des logs
  const filteredLogs = logs.filter(log => {
    const searchLower = searchTerm.toLowerCase();
    return (
      log.userId.name.toLowerCase().includes(searchLower) ||
      log.userId.email.toLowerCase().includes(searchLower) ||
      log.workflowId.name.toLowerCase().includes(searchLower) ||
      log.action.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Journal des activités</CardTitle>
            <CardDescription>
              Historique complet des actions des workflows
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Barre de recherche */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Rechercher par utilisateur, email, workflow ou action..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Statistiques rapides */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-blue-600 font-medium">Total</div>
                <div className="text-2xl font-bold text-blue-900">{filteredLogs.length}</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-sm text-green-600 font-medium">Complétés</div>
                <div className="text-2xl font-bold text-green-900">
                  {filteredLogs.filter(l => l.action === 'workflow_completed').length}
                </div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="text-sm text-red-600 font-medium">Échoués</div>
                <div className="text-2xl font-bold text-red-900">
                  {filteredLogs.filter(l => l.action === 'workflow_failed').length}
                </div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="text-sm text-yellow-600 font-medium">En pause</div>
                <div className="text-2xl font-bold text-yellow-900">
                  {filteredLogs.filter(l => l.action === 'workflow_paused').length}
                </div>
              </div>
            </div>

            {/* Table des logs */}
            <div className="border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Utilisateur</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Workflow</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Action</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredLogs.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                          Aucun log trouvé
                        </td>
                      </tr>
                    ) : (
                      filteredLogs.map((log) => (
                        <tr key={log._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">
                            {log.userId.name}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {log.userId.email}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {log.workflowId.name}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <Badge className={getActionBadgeVariant(log.action)}>
                              {formatAction(log.action)}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {formatDate(log.createdAt)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer avec nombre de résultats */}
            <div className="mt-4 text-sm text-gray-600">
              Affichage de {filteredLogs.length} résultat{filteredLogs.length > 1 ? 's' : ''} sur {logs.length} total
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LogsPage;