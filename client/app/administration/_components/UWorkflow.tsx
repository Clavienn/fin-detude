"use client"

import React, { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { WorkflowRepoAPI } from "@/infrastructures/repository/WorkflowRepoAPI"
import GestionVente from '@/components/features/tableau-de-bord/workflows/GestionVentes';
import GestionEmployees from '@/components/features/tableau-de-bord/workflows/GestionEmployee';
import GestionFormation from '@/components/features/tableau-de-bord/workflows/GestionFormation';

interface Categorie {
  _id: string
  code: string
  description?: string
}

interface Workflow {
  _id: string
  nom: string
  description?: string
  actif: boolean
  categorieId: Categorie
  createdAt: string
  updatedAt: string
}

export default function UWorkflow() {
  const params = useParams<{ id: string }>()
  const idWorkflow = params?.id
  
  const [workflow, setWorkflow] = useState<Workflow | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!idWorkflow) return

    const loadWorkflow = async () => {
      try {
        setLoading(true)
        const response = await WorkflowRepoAPI.getById(idWorkflow)
        setWorkflow(response)
      } catch (error) {
        console.error("Erreur chargement workflow :", error)
      } finally {
        setLoading(false)
      }
    }

    loadWorkflow()
  }, [idWorkflow])
  
  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4 text-gray-600">Chargement du workflow...</p>
        </div>
      </div>
    )
  }

  if (!workflow) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center text-gray-500">
          <p className="text-lg font-semibold">Aucun workflow trouvé</p>
          <p className="text-sm mt-2">Veuillez vérifier l'identifiant du workflow</p>
        </div>
      </div>
    )
  }

  // Fonction pour rendre le composant approprié selon la catégorie
  const renderWorkflowComponent = () => {
    switch (workflow.categorieId.code) {
      case "VENTE":
        return <GestionVente />
      
      case "RH":
      case "PERFO_EMP":
        return <GestionEmployees />
      
      case "FORMATION":
        return <GestionFormation />
      
      default:
        return (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">Type de workflow non pris en charge</p>
            <p className="text-sm mt-2">Catégorie : {workflow.categorieId.code}</p>
          </div>
        )
    }
  }

  return (
    <div className="space-y-2">
      <div className="mb-6">
        <h2 className="text-xl font-bold">{workflow.nom}</h2>
        {workflow.description && (
          <p className="text-gray-600 mt-1">{workflow.description}</p>
        )}
      </div>
      
      <div className="mt-6">
        {renderWorkflowComponent()}
      </div>
    </div>
  )
}