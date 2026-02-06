import Layouts from '@/components/layouts/users/Layouts'
import React from 'react'
import UWorkflow from '@/app/administration/_components/UWorkflow'



function page() {
  return (
    <div>
      <Layouts>
        <UWorkflow />
      </Layouts>
    </div>
  )
}

export default page