import React from 'react'

import Sidebar from './Sidebar'
import Dashboard from './Dashboard'

export default function Layout(props) {
    // console.log("Layout component props:", props)

  return (
    <div>
        <Sidebar />
        <Dashboard />
    </div>
  )
}
