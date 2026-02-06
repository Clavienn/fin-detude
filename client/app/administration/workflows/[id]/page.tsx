import LayoutsAdmin from '@/components/layouts/admin/Layouts'
import React from 'react'
import UWorkflow from '@/app/administration/_components/UWorkflow'

function page() {
    
  return (
    <div>
        <LayoutsAdmin>
          <UWorkflow />
        </LayoutsAdmin>
    </div>
  )
}

export default page