import DefaultLayout from '@/components/layouts/DefaultLayout'
import HomePage from '@/components/sections/HomePage'
import React from 'react'

function page() {
  return (
    <div>
      <DefaultLayout>
        <HomePage />
      </DefaultLayout>
    </div>
  )
}

export default page