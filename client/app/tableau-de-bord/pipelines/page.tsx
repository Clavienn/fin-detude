import DefaultLayout from '@/components/layouts/users/Layouts'
import React from 'react'
import ListPipeline from "@/app/tableau-de-bord/pipelines/_components/PipelineETL"

function page() {
  return (
    <div>
        <DefaultLayout>
          <ListPipeline />
        </DefaultLayout>
    </div>
  )
}

export default page