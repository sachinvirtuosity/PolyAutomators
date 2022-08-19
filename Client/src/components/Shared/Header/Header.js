import React, { Component, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import { useMetaMask } from "metamask-react";
import MetaMaskOnboarding from '@metamask/onboarding';
import { toast } from 'react-toastify';
import images from '../../../assets/icons';
//import {fs} from 'fs';
//import Web3Modal from "web3modal";
import {
  MiddleEllipsis,
  metaMaskLogin
} from "../../../helpers";
const Web3 = require('web3');

const web3 = new Web3(window.ethereum);

export default function Header({ connectWalletFn }) {
  const { status, connect, account, chainId, ethereum } = useMetaMask();
  const [usernm, setusernm] = useState("");
  const [library, setLibrary] = useState();
  const [isMmask, setisMmask] = useState(false);
  const [accountId, setAccountId] = useState('');
  const [isloading, setLoading] = useState(false);
  const onboarding = React.useRef();
  

  console.log(status);
  useEffect(async()=>{
    window.ethereum.on('accountsChanged', async() => {
      console.log("accountchange")
     // window.location.reload();
      Component.reload();
     // setaccountChanage(true);
    
    })
  })
  const handleTokenTool = async() => {
    setLoading(true);
    console.log(status);
    if (status == "unavailable") {

        onboarding.current = new MetaMaskOnboarding();
        onboarding.current.startOnboarding();


    } else {
        if (status == "notConnected") {
            ethereum.request({
                method: "eth_requestAccounts"

            }).then((res) => {
                setAccountId(res[0])
            });


        } else {
            setAccountId(account)

        }


    }
   
}
useEffect(async () => {
    if (accountId != '') {
        const resp = await metaMaskLogin(accountId);
        if (resp == "success") {
            navigate("/dashboard");
        } else {
            toast.error(resp.msg);
        }
        setLoading(false);

    }
}, [accountId]);

  const logOut = async () => {
    
    sessionStorage.clear();

    navigate("/");

  }


useEffect(()=>{
  console.log(sessionStorage.getItem("user"))

  if (sessionStorage.getItem("user") != null) {
   
    const user = JSON.parse(sessionStorage.getItem("user"));
    setusernm( user.username);
    setisMmask(user.isMetamask);
  }
},[])
  const navigate = useNavigate();
  const [showOptions, setShowOptions] = useState(false)
  return (
    <div className='flex items-center justify-between '>
      <div className='flex flex-row'>
        <p className='text-orange font-medium'>Token Tool &nbsp; </p>
        <p> by Poly Automator</p>
      </div>
      <div className='flex flex-row items-center justify-center'>

        {status != "connected" ? <p
          className='mr-4 cursor-pointer hover:text-orange'
          onClick={(e)=>handleTokenTool()}
        >
          Connect Wallet
        </p> :
        <div className='w-48 flex flex-col bg-blue-50 rounded-lg cursor-pointer' onClick={() => { setShowOptions(!showOptions) }}>
        
           { status != "connected"  ? 
             <div className='flex flex-row items-center border-b border-white'> 
          <span className='w-40 text-truncate '>{!isMmask? usernm:""}</span>
          </div>
          :
          <div className='flex flex-row items-center border-b border-white'>
          <span className='w-40 text-truncate '> {MiddleEllipsis(usernm, 12)}</span>
          <img src={images.MetaMask} style={{ width: "25px", height: '25px' }}></img>
          </div>
          
           }
       
         
          
          {!showOptions ? null :
            <div className='h-10 flex items-center justify-center cursor-pointer' onClick={() => { logOut() }}>
              <p className=' text-sm text-yellow-500 text-center'>
                Sign Out
              </p>
            </div>
          }
        </div>
}
      </div>

    </div>
  )
}

Header.propTypes = {
  connectWalletFn: PropTypes.func,
}
