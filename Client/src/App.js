import { Component, useEffect } from 'react'
import { Route, Router, Routes, Switch } from 'react-router-dom'
import './app.styles.scss'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Webform from './Pages/Webform'
import Login from './Pages/Login'
import RegisterUser from './Pages/RegisterUser'
import Dashboard from './Pages/Dashboard'
import RequiredAuth from './components/RequiredAuth';
import UserTokenDetails from './Pages/UserTokenDetails';
import ManageToken from './Pages/ManageToken';
import DistributeToken from './Pages/DistributeToken';
import HomeScreen from './Pages/HomeScreen';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      provider: '',
      web3: '',
      accounts: '',
      Balance: ''
    }
  }

  render() {
    return (
      <>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<RegisterUser />} />
          <Route path='/' element={<HomeScreen />} />
          <Route path='/dashboard'
            element={
              <RequiredAuth>
                <Dashboard />
              </RequiredAuth>
            }
          />
          <Route path='/create'
            element={
              <RequiredAuth>
                <Webform />
              </RequiredAuth>
            }
          />
          <Route path='/tokenList'
            element={
              <RequiredAuth>
                <UserTokenDetails />
              </RequiredAuth>
            }
          />
          <Route path='/manageToken'
            element={
              <RequiredAuth>
                <ManageToken />
              </RequiredAuth>
            }
          />
          <Route path='/distributeToken'
            element={
              <RequiredAuth>
                <DistributeToken />
              </RequiredAuth>
            }
          />
        </Routes>
        <ToastContainer theme="colored" Transition="flip"></ToastContainer>
      </>
    )
  }
}

export default App
