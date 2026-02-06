import WorkflowsList from '@/components/features/tableau-de-bord/workflows/ListWorkflows'
import Layouts from '@/components/layouts/users/Layouts'
import React from 'react'

function page() {
  return (
    <div>
      <Layouts>
        <WorkflowsList />
      </Layouts>
    </div>
  )
}

export default page