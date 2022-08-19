import React, { useState, useRef, useEffect } from 'react';
import FeatherIcon from "feather-icons-react";
import { useMetaMask } from "metamask-react";
const Web3 = require('web3');
import {
  metaMaskLogin
} from "../../helpers";




export default function ChangeNetwork() {
  const [showPopup, setshowPopup] = useState(false);
  const [accountChanage, setaccountChanage] = useState(false);
  const { account, ethereum } = useMetaMask();
  const web3 = new Web3(window.ethereum);


  useEffect(async () => {
    window.ethereum.on('accountsChanged', async () => {
      window.location.reload();
      setaccountChanage(true);

    })
    window.ethereum.on('disconnect', () => {

      window.location.reload();
    })
    window.ethereum.on('chainChanged', () => {
      window.location.reload();
    })

    let code = await web3.eth.getChainId();

    if (code != web3.utils.toHex("137") && code != web3.utils.toHex("80001")) {
      setshowPopup(!showPopup);
    }

  }, []);
  useEffect(async () => {
    if (accountChanage) {
      const resp = await metaMaskLogin(account);
      if (resp == "success") {
        navigate("/dashboard");
      } else {
        toast.error(resp.msg);
      }
    }
  }, [accountChanage])
  const changeNetworks = (values) => {

    ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: web3.utils.toHex(values) }]
    }).then(() => {
      setshowPopup(!showPopup);
    }).catch(async (err) => {
      if (err.code == "4902") {
        if (values == 137) {
          await ethereum.request({
            id: 1,
            jsonrpc: "2.0",
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: web3.utils.toHex("137"),
                rpcUrls: ["https://polygon-rpc.com"],

                chainName: "Polygon Mainnet",
                nativeCurrency: {
                  name: "MATIC",
                  symbol: "MATIC", // 2-6 characters long
                  decimals: 18,
                },
                blockExplorerUrls: ["https://polygonscan.com/"],
              },
            ],
          });

        } else {
          await ethereum.request({
            id: 1,
            jsonrpc: "2.0",
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: web3.utils.toHex("80001"),
                rpcUrls: ["https://rpc-mumbai.maticvigil.com"],
                chainName: "Polygon Testnet Mumbai",
                nativeCurrency: {
                  name: "tMATIC",
                  symbol: "tMATIC", // 2-6 characters long
                  decimals: 18,
                },
                blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
              },
            ],
          });

        }

      }
      // var index=networkItems.findIndex(item=>item.chainId==chainId);
      // if(index==-1){
      //     index=4;
      // }
      // setNetwork(networkItems[index]);
    })
  }
  return (

    <>

      {showPopup &&
        <div className='popup'>
          <div className='popup_inner'>
            <div className=''></div>
            <div></div>
            {/* <div className="dlts_bg "> */}
            <div className='container max-w-xl mx-auto'>
              <div className='font-semibold text-xl tracking-tight ml-40 py-10'>
                <FeatherIcon icon="alert-circle" color="red" size="40px"></FeatherIcon>
                Warning

              </div>
              <div>
                Network selected in your wallet is not supported. Please switch to one of supported networks.
              </div>



              <div className=" flex flex-row text-left w-max-lg">
                <button type='submit' className="flex-grow  w-70 bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-2 mr-4 rounded mt-9" onClick={() => changeNetworks("137")} >
                  Polygon Mainnet
                </button>
                <button type='submit' onClick={() => changeNetworks("80001")} className="flex-grow  w-70 bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-2 rounded mt-9" >
                  Polygon Testnet
                </button>
              </div>
            </div>
          </div>
        </div>
      }
    </>
  )
}