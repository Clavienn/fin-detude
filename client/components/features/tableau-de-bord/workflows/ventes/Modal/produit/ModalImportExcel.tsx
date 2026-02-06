"use client"

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ProduitRepoAPI } from '@/infrastructures/repository/ProduitRepoAPI';
import type { CreateProduitDTO } from '@/domains/dto/produit.dto';
import * as XLSX from 'xlsx';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';

interface ModalImportExcelProps {
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

const ModalImportExcel: React.FC<ModalImportExcelProps> = ({ 
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
    const hasNom = 'nom' in firstRow || 'Nom' in firstRow || 'name' in firstRow;
    const hasPu = 'pu' in firstRow || 'prix' in firstRow || 'price' in firstRow;
    const hasReference = 'reference' in firstRow || 'ref' in firstRow || 'Reference' in firstRow;

    if (!hasNom) {
      errors.push("Colonne 'nom' manquante. Colonnes acceptées: nom, Nom, name");
    }

    if (!hasPu) {
      errors.push("Colonne 'pu' (prix unitaire) manquante. Colonnes acceptées: pu, prix, price");
    }

    if (!hasReference) {
      warnings.push("Colonne 'reference' non trouvée. Les produits seront créés sans référence. Colonnes acceptées: reference, ref, Reference");
    }

    // Vérifier la validité des données
    let invalidPriceCount = 0;
    let emptyNameCount = 0;

    data.forEach((row, index) => {
      const nom = row.nom || row.Nom || row.name;
      const pu = row.pu || row.prix || row.price;

      if (!nom || nom.toString().trim() === '') {
        emptyNameCount++;
      }

      const puNumber = parseFloat(pu);
      if (isNaN(puNumber) || puNumber <= 0) {
        invalidPriceCount++;
      }
    });

    if (emptyNameCount > 0) {
      errors.push(`Le(s) ligne(s) avec nom vide ou manquant`);
    }

    if (invalidPriceCount > 0) {
      warnings.push(`Le(s) ligne(s) avec prix invalide seront ignorées (le prix doit être un nombre > 0)`);
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
        
        console.log("📊 Données Excel importées:", data);
        console.log("📝 Nombre de lignes:", data.length);
        console.log("🔍 Première ligne:", data[0]);
        
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
    console.log("🚀 Début de l'importation de", excelData.length, "produits");

    try {
      let successCount = 0;
      let errorCount = 0;
      let skippedCount = 0;
      const errorDetails: string[] = [];

      for (let i = 0; i < excelData.length; i++) {
        const row = excelData[i];
        try {
          const nom = row.nom || row.Nom || row.name || '';
          const puValue = row.pu || row.prix || row.price;
          const pu = parseFloat(puValue);
          const reference = row.reference || row.ref || row.Reference || '';

          // Validation - sauter les lignes invalides au lieu de bloquer
          if (!nom || nom.toString().trim() === '') {
            errorDetails.push(`Ligne ${i + 2}: Nom manquant - ligne ignorée`);
            skippedCount++;
            continue;
          }

          if (isNaN(pu) || pu <= 0) {
            errorDetails.push(`Ligne ${i + 2}: Prix invalide (${puValue}) - ligne ignorée`);
            skippedCount++;
            continue;
          }

          const newProduit: CreateProduitDTO = {
            nom: nom.toString().trim(),
            pu: pu,
            reference: reference ? reference.toString().trim() : undefined,
            actif: row.actif !== false,
            workflowId
          };

          await ProduitRepoAPI.create(newProduit);
          console.log("✅ Produit créé:", newProduit.nom);
          successCount++;
        } catch (err) {
          console.error("❌ Erreur création produit:", err);
          errorDetails.push(`Ligne ${i + 2}: Erreur serveur`);
          errorCount++;
        }
      }

      console.log(`✨ Import terminé: ${successCount} succès, ${skippedCount} ignorées, ${errorCount} erreurs`);
      
      let message = `Import terminé:\n✅ ${successCount} produit(s) créé(s)`;
      if (skippedCount > 0) {
        message += `\n⚠️ ${skippedCount} ligne(s) ignorée(s) (données invalides)`;
      }
      if (errorCount > 0) {
        message += `\n❌ ${errorCount} erreur(s) serveur`;
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
          <DialogTitle>Importer des produits depuis Excel</DialogTitle>
          <DialogDescription>
            Sélectionnez un fichier Excel (.xlsx, .xls) contenant les colonnes requises
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Fichier Excel</Label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileSelect}
              disabled={isLoading}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
            />
          </div>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Colonnes requises:</strong>
              <ul className="list-disc list-inside mt-1 text-sm">
                <li><strong>nom</strong> (ou Nom, name) - Obligatoire</li>
                <li><strong>pu</strong> (ou prix, price) - Obligatoire, doit être un nombre &gt; 0</li>
                <li><strong>reference</strong> (ou ref, Reference) - Optionnelle</li>
              </ul>
            </AlertDescription>
          </Alert>

          {selectedFile && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium">
                📄 Fichier sélectionné: {selectedFile.name}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Taille: {(selectedFile.size / 1024).toFixed(2)} KB
              </p>
            </div>
          )}

          {validationResult && validationResult.errors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Erreurs détectées:</strong>
                <ul className="list-disc list-inside mt-1 text-sm">
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
                <strong>Avertissements:</strong>
                <ul className="list-disc list-inside mt-1 text-sm">
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
                <strong>✅ {excelData.length} ligne(s) prête(s) à être importée(s)</strong>
                {validationResult.warnings.length > 0 && (
                  <p className="text-sm mt-1">Les produits seront créés malgré les avertissements.</p>
                )}
              </AlertDescription>
            </Alert>
          )}

          {excelData.length > 0 && (
            <div className="mt-2">
              <Label className="text-sm font-medium">Aperçu des données (3 premières lignes):</Label>
              <div className="mt-2 max-h-48 overflow-y-auto">
                <pre className="text-xs bg-white p-2 rounded border">
                  {JSON.stringify(excelData.slice(0, 3), null, 2)}
                </pre>
              </div>
            </div>
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
          >
            {isLoading ? 'Importation...' : `Importer ${excelData.length} produit(s)`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalImportExcel;