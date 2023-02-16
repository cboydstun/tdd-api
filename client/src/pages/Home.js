import React from 'react'

import { useHistory } from 'react-router-dom'

import Layout from '../components/Layout'

export default function Home() {
  const history = useHistory()
  // must have a token to access this page
  const token = localStorage.getItem('token')

  if (!token) {
    history.push('/')
  }

  return (
    <div>
      <Layout token={token} />
    </div>
  )
}
