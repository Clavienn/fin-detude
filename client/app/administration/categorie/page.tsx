import LayoutsAdmin from '@/components/layouts/admin/Layouts'
import React from 'react'
import ListCategorie from '../_components/ListCategorie'

function page() {
  return (
    <div>
      <LayoutsAdmin>
        <ListCategorie />
      </LayoutsAdmin>
    </div>
  )
}

export default page