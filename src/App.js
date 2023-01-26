import logo from './logo.svg';
import './App.css';
import ReCAPTCHA from 'react-google-recaptcha';
import React,{createContext, useContext, useRef} from 'react';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import { Layout } from './Layout';
import { Login, loguser } from './components/Login';
import { Signup } from './components/Signup';
import { Forgpass } from './Forgpass';
import { Wallet } from './components/wallet';
import { render } from '@testing-library/react';
import { Dashboard } from './components/Dashboard';
import {Provider} from 'react-redux'
export const luser=createContext();

export default function App() {
  const user=useContext(loguser);
  return (
    <luser.Provider value={user}>
    <div className="App">
      
       
       <BrowserRouter>
         <Routes>
             <Route path="/" element={<Layout/>}>
              <Route index element={<Login flag="true"/>}/>
              <Route path='/wallet' element={<Wallet/>}/>
              <Route path='/Sign-up' element={<Signup flag="true"/>}/>
              <Route path='/Forgot-pass' element={<Forgpass flag="true" />}/>
              <Route path='/dashboard' element={<Dashboard/>}/>
             </Route>
         </Routes>
       </BrowserRouter>
    </div>
    </luser.Provider>
  );
}

