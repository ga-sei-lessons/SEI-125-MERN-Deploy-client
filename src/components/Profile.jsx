import { useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import axios from 'axios'
import Login from './Login'

export default function Profile(props) {
  // console.log(props.currentUser)
  // make some state for the data from the server
  const [message, setMessage] = useState('')

  // useEffect to get the data from the server
  useEffect(() => {
    const secretMessage = async function() {
      try {
        // get our jwt from local storage
        const token = localStorage.getItem('jwtToken')
        // make some Auth headers
        const authHeaders = {
          'Authorization': token
        }
        // GET /auth-locked with the auth headers
        const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api-v1/users/auth-locked`, { headers: authHeaders })
        // example posting with headers
        // const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/auth-v1/users/auth-locked`, { requestBody }, { headers: authHeaders })
        // set the message in state with the data from the backend
        console.log(response.data)
        setMessage(response.data.msg)

      } catch(error) {
        // server responds w/status of 400 on auth failure
        if(error.response.status === 400) {
          props.handleLogout()

        } else {
          console.log('🔥🔥🔥🔥🔥🔥🔥🔥', error)
        }
      }
    }

    // dont forget to invoke!
    secretMessage()
  }, [props])

  // redirect to login if auth failed
  if(!props.currentUser) return <Redirect to='/login' component={ Login } />
  
  return (
    <div>
      <h4>hello {props.currentUser.name}</h4>
      <h5>your email is {props.currentUser.email}</h5>

      <p>your secret message is: {message}</p>
    </div>
  )
}