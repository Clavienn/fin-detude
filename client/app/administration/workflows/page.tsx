
import LayoutsAdmin from '@/components/layouts/admin/Layouts'
import React from 'react'
import ListWorkflow from '../_components/ListWorkflow'

function page() {
  return (
    <div>
      <LayoutsAdmin>
        <ListWorkflow />
      </LayoutsAdmin>
    </div>
  )
}

export default page