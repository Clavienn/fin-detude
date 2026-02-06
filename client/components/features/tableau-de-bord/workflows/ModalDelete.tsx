import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AlertTriangle } from 'lucide-react';

interface ModalDeleteProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  workflowName: string;
}

const ModalDelete: React.FC<ModalDeleteProps> = ({
  isOpen,
  onClose,
  onConfirm,
  workflowName,
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-100 rounded-full">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <AlertDialogTitle className="text-xl">
              Supprimer le workflow
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-base pt-2">
            Êtes-vous sûr de vouloir supprimer le workflow{' '}
            <span className="font-semibold text-gray-900">{workflowName}</span> ?
          </AlertDialogDescription>
          <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mt-4">
            <p className="text-sm text-amber-800">
              ⚠️ Cette action est irréversible. Toutes les données associées à ce
              workflow seront définitivement supprimées.
            </p>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel onClick={onClose}>Annuler</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            Supprimer définitivement
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ModalDelete;