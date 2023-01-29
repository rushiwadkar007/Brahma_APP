import logo from './logo.svg';
import './App.css';
import ReCAPTCHA from 'react-google-recaptcha';
import React,{createContext, useContext,useState, useEffect,useRef} from 'react';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import { Layout } from './Layout';
import { Login, loguser } from './components/Login';
import { Signup } from './components/Signup';
import { Forgpass } from './Forgpass';
import { Wallet } from './components/wallet';
import { render } from '@testing-library/react';
import { Dashboard } from './components/Dashboard';
import {Provider} from 'react-redux'
import data from "./contractdetails/Brahma.json"
import Web3 from "web3";
const ABI = data.abi
const ADDRESS = data.networks[3].address
export const luser=createContext();

export default function App() {
  const user=useContext(loguser);
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState("");

  useEffect(() => {

    const initWeb3 = async () => {
      // Connect to the blockchain
      const web3 = new Web3(Web3.givenProvider);

      // Get the contract instance
      const contract = new web3.eth.Contract(ABI, ADDRESS);
      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];
      setWeb3(web3);
      setContract(contract);
      setAccount(account);
    };
    initWeb3();
  }, []);
  return (
    <luser.Provider value={user}>
    <div className="App">
       <BrowserRouter>
         <Routes>
             <Route path="/" element={<Layout web3={web3} contract={contract} account={account}/>}>
              <Route index element={<Login flag="true" web3={web3} contract={contract} account={account}/>}/>
              <Route path='/wallet' element={<Wallet web3={web3} contract={contract} account={account}/>}/>
              <Route path='/Sign-up' element={<Signup flag="true" web3={web3} contract={contract} account={account}/>}/>
              <Route path='/Forgot-pass' element={<Forgpass flag="true" web3={web3} contract={contract} account={account}/>}/>
              <Route path='/dashboard' element={<Dashboard web3={web3} contract={contract} account={account}/>}/>
             </Route>
         </Routes>
       </BrowserRouter>
    </div>
    </luser.Provider>
  );
}

