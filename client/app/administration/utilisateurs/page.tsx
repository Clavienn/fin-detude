import LayoutsAdmin from '@/components/layouts/admin/Layouts'
import React from 'react'
import ListUser from '../_components/ListUser'

function page() {
  return (
    <div>
      <LayoutsAdmin>
        <ListUser />
      </LayoutsAdmin>
    </div>
  )
}

export default page