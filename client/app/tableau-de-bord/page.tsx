import Layouts from '@/components/layouts/users/Layouts'
import React from 'react'
import Dashboard from "@/components/features/tableau-de-bord/Dashboard"

function page() {
  return (
    <div>
      <Layouts>
        <Dashboard />
      </Layouts>
    </div>
  )
}

export default page