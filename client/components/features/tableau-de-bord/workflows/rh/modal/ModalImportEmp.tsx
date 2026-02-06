"use client"

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { EmployeeRepoAPI } from '@/infrastructures/repository/EmployeeRepoAPI';
import type { CreateEmployeeDTO } from '@/domains/dto/employee.dto';
import * as XLSX from 'xlsx';
import { AlertCircle, CheckCircle2, Info, Loader2, Upload } from 'lucide-react';

interface ModalImportEmployeeProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  workflowId: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

const ModalImportEmployee: React.FC<ModalImportEmployeeProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  workflowId 
}) => {
  const [excelData, setExcelData] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetModal = () => {
    setExcelData([]);
    setSelectedFile(null);
    setValidationResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateExcelData = (data: any[]): ValidationResult => {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (data.length === 0) {
      errors.push("Le fichier Excel est vide");
      return { isValid: false, errors, warnings };
    }

    // Vérifier les colonnes requises
    const firstRow = data[0];
    const hasMatricule = 'matricule' in firstRow || 'Matricule' in firstRow || 'MATRICULE' in firstRow;
    const hasNom = 'nom' in firstRow || 'Nom' in firstRow || 'NOM' in firstRow || 'name' in firstRow;
    const hasPoste = 'poste' in firstRow || 'Poste' in firstRow || 'POSTE' in firstRow || 'position' in firstRow;

    if (!hasMatricule) {
      errors.push("Colonne 'matricule' manquante. Colonnes acceptées: matricule, Matricule, MATRICULE");
    }

    if (!hasNom) {
      errors.push("Colonne 'nom' manquante. Colonnes acceptées: nom, Nom, NOM, name");
    }

    if (!hasPoste) {
      warnings.push("Colonne 'poste' non trouvée. Les employés seront créés sans poste. Colonnes acceptées: poste, Poste, POSTE, position");
    }

    // Vérifier la validité des données
    let emptyMatriculeCount = 0;
    let emptyNomCount = 0;
    const matricules = new Set<string>();
    const duplicateMatricules: string[] = [];

    data.forEach((row, index) => {
      const matricule = row.matricule || row.Matricule || row.MATRICULE;
      const nom = row.nom || row.Nom || row.NOM || row.name;

      if (!matricule || matricule.toString().trim() === '') {
        emptyMatriculeCount++;
      } else {
        const matriculeStr = matricule.toString().trim();
        if (matricules.has(matriculeStr)) {
          duplicateMatricules.push(matriculeStr);
        }
        matricules.add(matriculeStr);
      }

      if (!nom || nom.toString().trim() === '') {
        emptyNomCount++;
      }
    });

    if (emptyMatriculeCount > 0) {
      errors.push(`${emptyMatriculeCount} ligne(s) avec matricule vide ou manquant`);
    }

    if (emptyNomCount > 0) {
      errors.push(`${emptyNomCount} ligne(s) avec nom vide ou manquant`);
    }

    if (duplicateMatricules.length > 0) {
      warnings.push(`Matricules en double détectés: ${[...new Set(duplicateMatricules)].join(', ')}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setValidationResult(null);
    const reader = new FileReader();

    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        
        
        setExcelData(data);
        
        // Valider les données
        const validation = validateExcelData(data);
        setValidationResult(validation);
        
      } catch (error) {
        console.error("❌ Erreur lors de la lecture du fichier Excel:", error);
        setValidationResult({
          isValid: false,
          errors: ["Erreur lors de la lecture du fichier Excel. Vérifiez que le format est correct."],
          warnings: []
        });
      }
    };

    reader.readAsBinaryString(file);
  };

  const handleImport = async () => {
    if (excelData.length === 0) {
      alert("Aucune donnée à importer");
      return;
    }

    if (validationResult && !validationResult.isValid) {
      alert("Veuillez corriger les erreurs avant d'importer");
      return;
    }

    setIsLoading(true);
    console.log("🚀 Début de l'importation de", excelData.length, "employés");

    try {
      let successCount = 0;
      let errorCount = 0;
      let skippedCount = 0;
      const errorDetails: string[] = [];

      for (let i = 0; i < excelData.length; i++) {
        const row = excelData[i];
        try {
          const matricule = (row.matricule || row.Matricule || row.MATRICULE || '').toString().trim();
          const nom = (row.nom || row.Nom || row.NOM || row.name || '').toString().trim();
          const poste = row.poste || row.Poste || row.POSTE || row.position;

          // Validation - sauter les lignes invalides
          if (!matricule) {
            errorDetails.push(`Ligne ${i + 2}: Matricule manquant - ligne ignorée`);
            skippedCount++;
            continue;
          }

          if (!nom) {
            errorDetails.push(`Ligne ${i + 2}: Nom manquant - ligne ignorée`);
            skippedCount++;
            continue;
          }

          const newEmployee: CreateEmployeeDTO = {
            matricule,
            nom,
            poste: poste ? poste.toString().trim() : undefined,
            workflowId
          };

          await EmployeeRepoAPI.create(newEmployee);
          successCount++;
        } catch (err: any) {
          console.error("❌ Erreur création employé:", err);
          
          // Détecter les erreurs de duplication
          if (err?.response?.data?.message?.includes('duplicate') || 
              err?.response?.data?.message?.includes('E11000')) {
            errorDetails.push(`Ligne ${i + 2}: Matricule déjà existant`);
          } else {
            errorDetails.push(`Ligne ${i + 2}: Erreur serveur`);
          }
          errorCount++;
        }
      }

      console.log(`✨ Import terminé: ${successCount} succès, ${skippedCount} ignorées, ${errorCount} erreurs`);
      
      let message = `Import terminé:\n✅ ${successCount} employé(s) créé(s)`;
      if (skippedCount > 0) {
        message += `\n⚠️ ${skippedCount} ligne(s) ignorée(s) (données invalides)`;
      }
      if (errorCount > 0) {
        message += `\n❌ ${errorCount} erreur(s)`;
      }
      if (errorDetails.length > 0) {
        message += `\n\nDétails:\n${errorDetails.slice(0, 5).join('\n')}`;
        if (errorDetails.length > 5) {
          message += `\n... et ${errorDetails.length - 5} autre(s)`;
        }
      }
      
      alert(message);
      
      if (successCount > 0) {
        onSuccess();
        resetModal();
      }
    } catch (error) {
      console.error("❌ Erreur lors de l'importation:", error);
      alert("Une erreur est survenue lors de l'importation");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      resetModal();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Importer des employés depuis Excel
          </DialogTitle>
          <DialogDescription>
            Sélectionnez un fichier Excel (.xlsx, .xls) contenant les colonnes requises
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="file-upload">Fichier Excel</Label>
            <input
              id="file-upload"
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileSelect}
              disabled={isLoading}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50 cursor-pointer"
            />
          </div>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Colonnes requises:</strong>
              <ul className="list-disc list-inside mt-2 text-sm space-y-1">
                <li>
                  <strong>matricule</strong> (ou Matricule, MATRICULE) - <span className="text-red-600">Obligatoire, unique</span>
                </li>
                <li>
                  <strong>nom</strong> (ou Nom, NOM, name) - <span className="text-red-600">Obligatoire</span>
                </li>
                <li>
                  <strong>poste</strong> (ou Poste, POSTE, position) - <span className="text-gray-600">Optionnelle</span>
                </li>
              </ul>
            </AlertDescription>
          </Alert>

          {selectedFile && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded">
                  <Upload className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-blue-900">
                    📄 {selectedFile.name}
                  </p>
                  <p className="text-xs text-blue-700 mt-0.5">
                    Taille: {(selectedFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
            </div>
          )}

          {validationResult && validationResult.errors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>❌ Erreurs détectées:</strong>
                <ul className="list-disc list-inside mt-2 text-sm space-y-1">
                  {validationResult.errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {validationResult && validationResult.warnings.length > 0 && (
            <Alert className="border-yellow-500 bg-yellow-50">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                <strong>⚠️ Avertissements:</strong>
                <ul className="list-disc list-inside mt-2 text-sm space-y-1">
                  {validationResult.warnings.map((warning, index) => (
                    <li key={index}>{warning}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {validationResult && validationResult.isValid && (
            <Alert className="border-green-500 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <div className="flex items-center gap-2">
                  <strong>✅ {excelData.length} employé(s) prêt(s) à être importé(s)</strong>
                </div>
                {validationResult.warnings.length > 0 && (
                  <p className="text-sm mt-1">Les employés seront créés malgré les avertissements.</p>
                )}
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={handleClose} 
            disabled={isLoading}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleImport} 
            disabled={isLoading || excelData.length === 0 || (validationResult !== null && !validationResult.isValid)}
            className="gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Importation...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Importer {excelData.length} employé(s)
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Composant Table simple pour l'aperçu
const Table = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <table className={`w-full ${className}`}>{children}</table>
);

const TableHeader = ({ children }: { children: React.ReactNode }) => (
  <thead>{children}</thead>
);

const TableBody = ({ children }: { children: React.ReactNode }) => (
  <tbody>{children}</tbody>
);

const TableRow = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <tr className={className}>{children}</tr>
);

const TableHead = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <th className={`px-3 py-2 text-left ${className}`}>{children}</th>
);

const TableCell = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <td className={`px-3 py-2 border-t ${className}`}>{children}</td>
);

export default ModalImportEmployee;