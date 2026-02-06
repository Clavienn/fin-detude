"use client"

import React, { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { WorkflowRepoAPI } from "@/infrastructures/repository/WorkflowRepoAPI"
import GestionVente from '@/components/features/tableau-de-bord/workflows/GestionVentes';
import GestionEmployees from '@/components/features/tableau-de-bord/workflows/GestionEmployee';


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
    return <div>Chargement...</div>
  }

  if (!workflow) {
    return <div>Aucun workflow trouvé</div>
  }


  return (
    <div className="space-y-2">
      <h2 className="text-xl font-bold">Workflow</h2>
      <div className="mt-6">
        {workflow.categorieId.code === "VENTE"
          ? <GestionVente />
          : <GestionEmployees />}
      </div>
    </div>
  )
}
