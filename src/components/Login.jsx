import { useState } from 'react'
import axios from 'axios'
import jwt_decode from 'jwt-decode'
import { Redirect } from 'react-router-dom'
import Profile from './Profile.jsx'

export default function Login(props) {
  // app state for controlled form
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  // flash message for login problems
  const [message, setMessage] = useState('')

  // handle submit button for the form
  const handleSubmit = async (e) => {
    try {
      e.preventDefault()
      // post to backend with form data
      const requestBody = {
        email: email,
        password: password
      }

      const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api-v1/users/login`, requestBody)

      const { token } = response.data

      // save the response jwt in local storage
      localStorage.setItem('jwtToken', token)

      // decode jwt and set the app state to the jwt payload
      const decoded = jwt_decode(token)
      console.log(decoded)

      props.setCurrentUser(decoded)

    } catch(error) {
      // if the login failed -- display a message
      if(error.response.status === 400) {
        // console.log(error.response.data)
        setMessage(error.response.data.msg)
      } else {
        console.error(error)
      }
    }
  }

  // if check to see if the user is logged in, redirect to the profile
  if(props.currentUser) return <Redirect to='/profile' component={ Profile } currentUser={ props.currentUser }/>

  return (
    <div>
      <h3>Login Form:</h3>

      <p>{message}</p>

      <form onSubmit={handleSubmit}>
        <label htmlFor='email-input'>Email:</label>

        <input 
          id='email-input'
          type='email'
          placeholder='user@url.com'
          onChange={e => setEmail(e.target.value)}
          value={email}
        />

        <label htmlFor='password-input'>Password:</label>

        <input 
          id='password-input'
          type='password'
          placeholder='password....'
          onChange={e => setPassword(e.target.value)}
          value={password}
        />

        <input 
          type='submit'
          value='login'
        />

      </form>
    </div>
  )
}