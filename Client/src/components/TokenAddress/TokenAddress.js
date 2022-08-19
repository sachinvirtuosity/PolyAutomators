import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from "react-router-dom";
import { toast } from 'react-toastify';
import Loader from 'react-loading';
const Web3 = require('web3');
const connectionURL = "https://ropsten.infura.io/v3/1f32a6562a8c4cae9f9d32c4ed179314";
//var web3 = new Web3(new Web3.providers.HttpProvider(connectionURL));

const web3 = new Web3(window.ethereum);

import AlphaTokenDtls from '../../../contracts/build/contracts/AlphaToken.json';
import {
    USER_BASE_URL,
    globalService,
    GET_CONTRACT_VALUE
} from "../../helpers";
import { CreateTokenIcon } from '../../assets/SvgComponent';
export default function TokenAddress({ getTokenAddress }) {
    const [tokenAddress, setTokenAddress] = useState("");
    const [isloading, setLoading] = useState(false);
    const [isBtnDisable, setIsBtnDisable] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");
    // const [tokenDetails,setTokenName]=useState({tokenAddress:"",tokenName:"",tokenSupply:"",owner:""});
    var tokenDetails = {};
    const getTokenDetails = async () => {

        validate(tokenAddress);
        if (tokenAddress != "" && errorMsg == "") {
            setLoading(!isloading);
            const user = JSON.parse(sessionStorage.getItem("user"));
            try {
                let reqObj = {
                    method: "GET",
                    headers: { "authorization": `Bearer ${user.token}` },
                    url: `${USER_BASE_URL}/${GET_CONTRACT_VALUE}/erc20Airdrop`,//CommonERC20,

                };

                var resp = await globalService(reqObj);
                if (resp != null) {

                    const tokenInst = new web3.eth.Contract(resp.contractABI, tokenAddress);
                    console.log("================tokenInst====================");
                    console.log(tokenInst);
                    tokenDetails.tokenSupply = await tokenInst.methods.totalSupply().call();
                    console.log(tokenDetails);
                    tokenDetails.tokenName = await tokenInst.methods.name().call();
                    console.log(tokenDetails);
                    //  tokenDetails.Owner = await tokenInst.methods.getowner().call();
                    // tokenDetails.Owner = "";

                  //  tokenDetails.Owner = await tokenInst.methods.owner().call();
                    tokenDetails.tokenAddress = tokenAddress;
                    tokenDetails.ispaused = false;


                }
            } catch (ex) {
                // getTokenAddress(u);
                setLoading(false);
                tokenDetails=null;
                console.log(ex);
                toast.error("Invalid Contract Address");

            }
            try {
                let reqObj = {
                    method: "GET",
                    headers: { "authorization": `Bearer ${user.token}` },
                    url: `${USER_BASE_URL}/${GET_CONTRACT_VALUE}/erc20Airdrop`,//CommonERC20,

                };

                var resp = await globalService(reqObj);
                if (resp != null) {

                    const tokenInst = new web3.eth.Contract(resp.contractABI, tokenAddress);
                    console.log("================tokenInst====================");
                    
                    tokenDetails.Owner = await tokenInst.methods.owner().call();
                }
                
            } catch (ex) {
                // getTokenAddress(u);
                setLoading(false);
                console.log(ex);
               // toast.error("Invalid Contract Address");

            }
            try {
                let reqObjPause = {
                    method: "GET",
                    headers: { "authorization": `Bearer ${user.token}` },
                    url: `${USER_BASE_URL}/${GET_CONTRACT_VALUE}/PausableERC20`,

                };

                var respause = await globalService(reqObjPause);
                console.log(respause);
                const tokenPauseInst = new web3.eth.Contract(respause.contractABI, tokenAddress);
                console.log(tokenPauseInst);
                tokenDetails.ispaused = await tokenPauseInst.methods.paused().call();
                //tokenDetails.Owner = "";
                console.log("tokenDetails");
                console.log(tokenDetails);

                getTokenAddress(tokenDetails);
                setLoading(false);

            } catch (ex) {
                if(tokenDetails!=null){
                tokenDetails.ispaused = false;
                }
                getTokenAddress(tokenDetails);
                setLoading(false);
            }
        }
    }
    const handleAddressChange = (tokenAddrs) => {
        validate(tokenAddrs);
        setTokenAddress(tokenAddrs);
    }
    const validate = (tokenAddrs) => {
        let contractAddress_regex = new RegExp('0x[a-fA-F0-9]{40}$');
        if (tokenAddrs == "") {
            setErrorMsg("Token Address Required");
            setIsBtnDisable(true);
        } else if (!contractAddress_regex.test(tokenAddrs)) {
            setErrorMsg("Required Valid Token Address");
            setIsBtnDisable(true);
        } else {
            setErrorMsg("");
            setIsBtnDisable(false);
        }
    }
    return (
        <div className='grid grid-row-2 md:grid-cols-2 bg-white rounded-lg mt-5 p-4'>

            <div className='row-span-1 md:col-span-1 p-6'>
                <div className='flex flex-row items-center mb-3'>
                    <div className='w-6'>
                        <CreateTokenIcon />
                    </div>
                    <p className='text-base font-light pl-2'>Create liquidity pool</p>
                </div>
                <div className='flex flex-row items-center mb-3'>
                    <div className='w-6'>
                        <CreateTokenIcon />
                    </div>
                    <p className='text-base font-light pl-2'>Mint additional tokens, burn tokens</p>
                </div>
                <div className='flex flex-row items-center mb-3'>
                    <div className='w-6'>
                        <CreateTokenIcon />
                    </div>
                    <p className='text-base font-light pl-2'>Change token owner or renounce ownership</p>
                </div>
                <div className='flex flex-row items-center mb-3'>
                    <div className='w-6'>
                        <CreateTokenIcon />
                    </div>
                    <p className='text-base font-light pl-2'>Pause and unpause, manage whitelist and blacklist</p>
                </div>
                <div className='flex flex-row items-center mb-3'>
                    <div className='w-6'>
                        <CreateTokenIcon />
                    </div>
                    <p className='text-base font-light pl-2'>Works with all your tokens, even if created without Token Tool</p>
                </div>
            </div>

            <div className="row-span-1 md:col-span-1 w-full my-6 max-w-sm bg-white rounded-lg border border-gray-200 shadow-md p-2 sm:p-4 lg:p-6 dark:bg-gray-800 dark:border-gray-700 mx-auto">

                <div>
                    <label for="tokanAddress" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                        Token contract address<span className="text-red-600">*</span></label>
                    <input
                        type="text"
                        name="tokanAddress"
                        id="tokanAddress"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        placeholder="Token Name"
                        onChange={(e) => {
                            handleAddressChange(e.currentTarget.value)

                        }}
                        required
                    />
                    {errorMsg != "" && (
                        <div className="help-block text-red-900 text-sm">{errorMsg}</div>
                    )}
                </div>

                <div className="intro-x text-center xl:text-left">
                    {isloading ? <div className="cover-spin flex justify-center items-center">

                        <Loader type={'spinningBubbles'} color="#ed8936">

                        </Loader>

                    </div> :
                        <button type='submit' className="w-full bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-2 rounded mt-9" onClick={getTokenDetails}>
                            Continue
                        </button>
                    }
                    <br></br>
                    <p className='my-2'>
                        Don’t have your own token yet? <NavLink to="/create" className="text-blue-500"> Create Token </NavLink>
                    </p>

                </div>
            </div>
        </div>
    )
}