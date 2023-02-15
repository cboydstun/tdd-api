import React from 'react'

import Sidebar from './Sidebar'
import Dashboard from './Dashboard'

export default function Layout(props) {
    console.log(props)

  return (
    <div>
        <Sidebar />
        <Dashboard />
    </div>
  )
}
