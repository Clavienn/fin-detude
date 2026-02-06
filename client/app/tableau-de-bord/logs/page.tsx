import LogsPage from '@/components/features/tableau-de-bord/workflows/Logs'
import Layouts from '@/components/layouts/users/Layouts'
import React from 'react'

function page() {
  return (
    <div>
        <Layouts>
            <LogsPage />
        </Layouts>
    </div>
  )
}

export default page