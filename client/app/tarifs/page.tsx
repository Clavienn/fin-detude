import DefaultLayout from '@/components/layouts/DefaultLayout'
import React from 'react'
import Tarifs from "@/components/sections/Tarif"

function page() {
  return (
    <div>
        <DefaultLayout>
            <Tarifs />
        </DefaultLayout>
    </div>
  )
}

export default page