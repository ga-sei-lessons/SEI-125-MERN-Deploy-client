import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import jwt_decode from 'jwt-decode'
import Navbar from './components/Navbar'
import Login from './components/Login'
import Profile from './components/Profile'
import Register from './components/Register'
import Welcome from './components/Welcome'
import './App.css';

function App() {
  // user data will be in state when the user is logged in 
  const [currentUser, setCurrentUser] = useState(null)

  // useEffect if the user navigates away from the site and comes back
  useEffect(() => {
    const token = localStorage.getItem('jwtToken')
    if(token) {
      // decode the token if it is found in local storage
      const decoded = jwt_decode(token)
      // set the current user
      setCurrentUser(decoded)
    } else {
      // make sure state reflects that there is no user logged in
      setCurrentUser(null)
    }
  }, [])

  // deletes the jwt from local storage when the user wants to log out
  const handleLogout = () => {
    if (localStorage.getItem('jwtToken')) {
      localStorage.removeItem('jwtToken')
      setCurrentUser(null)
    }
  }

  return (
    <Router>
      <header>
        <Navbar currentUser={ currentUser } handleLogout={ handleLogout } />
      </header>

      <div className="App">
        <Switch>
          <Route exact path="/" component={ Welcome } />

          <Route 
            path='/register'
            render={ (props) => <Register {...props} currentUser={ currentUser } setCurrentUser={ setCurrentUser} /> } 
          />

          <Route 
            path='/login'
            render={ (props) => <Login {...props} currentUser={ currentUser } setCurrentUser={ setCurrentUser} /> } 
          />

          <Route 
            path='/profile'
            render={ (props) => currentUser 
              ? <Profile {...props} handleLogout={ handleLogout } currentUser={ currentUser } setCurrentUser={ setCurrentUser} /> 
              : <Redirect to='/login' /> } 
          />

        </Switch>
      </div>
    </Router>
  );
}

export default App;
