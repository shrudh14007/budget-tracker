import React, { ReactNode } from 'react'

function layout({children}:{children:ReactNode}) {
  return (
    <div className='relative flex h-screen w-full flex-col items'>layout</div>
  )
}

export default layout