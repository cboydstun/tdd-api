import React, { useState, useEffect } from 'react'

import Home from './Home'

import { useHistory } from 'react-router-dom'

const LoginForm = (props) => {
  const history = useHistory()
  //state for form information
  const [formInfo, setFormInfo] = useState({
    email: 'felicia@email.com',
    password: 'password'
  })

  const [hasToken, setHasToken] = useState(false)

  //handle change for form
  const handleChange = (e) => {
    setFormInfo({
      ...formInfo,
      [e.target.name]: e.target.value
    })
  }

  //POST request
  const handleSubmit = (e) => {
    e.preventDefault()
    fetch('https://rockettestserver.xyz/api/v1/users/login', {
      method: 'POST',
      body: JSON.stringify(formInfo),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',

      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.token) {
          //if a token is returned, set the token in local storage
          localStorage.setItem('token', data.token)
          setHasToken(true)
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  return (
    <div>
      {hasToken ? <Home /> :

        <form onSubmit={handleSubmit}>
          <label>Email:</label>
          <input
            name="email"
            type="text"
            value={formInfo.email}
            onChange={handleChange}
          />
          <label>Password:</label>
          <input
            name="password"
            type="password"
            value={formInfo.password}
            onChange={handleChange}
          />
          <button type="submit">Submit</button>
        </form>
      }
    </div>
  )
}

export default LoginForm