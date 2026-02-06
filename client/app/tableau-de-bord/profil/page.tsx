import ProfilePage from '@/components/features/tableau-de-bord/Profil'
import Layouts from '@/components/layouts/users/Layouts'
import React from 'react'

function page() {
  return (
    <div>
      <Layouts>
        <ProfilePage />
      </Layouts>
    </div>
  )
}

export default page