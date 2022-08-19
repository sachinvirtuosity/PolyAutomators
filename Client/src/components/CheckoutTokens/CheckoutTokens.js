import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMetaMask } from "metamask-react";
import { toast } from 'react-toastify';
import Loader from 'react-loading';
const Web3 = require('web3');
const web3 = new Web3(window.ethereum);

import {
    USER_BASE_URL,
    globalService,
    CREATE_TOKEN_URL,
    GET_CONTRACT_VALUE
} from "../../helpers";



export default function CheckoutTokens(tokenDtl) {
    const { status, account, ethereum } = useMetaMask();
    const navigate = useNavigate();
    const btnRef = useRef();
    const [checked, setChecked] = useState(false);
    const [isloading, setLoading] = useState(false);
    const [summery, setSummery] = useState(tokenDtl);
    const [showError, setShowError] = useState(false);
    const user = JSON.parse(sessionStorage.getItem("user"));

    useEffect(() => {
       
        setSummery(tokenDtl);
        if (tokenDtl.setTokenDetails["validForm"] == true && tokenDtl.setTokenDetails.billingDetails.validBillingDtls == true) {
            setShowError(false)
        } else {
            setShowError(true)
        }
    }, [tokenDtl])
   
    const handleCheckboxChange = () => setChecked(!checked);
    const deploy = async (tokenObj, rowContract) => {
        var returnData = {};
        try {
            var argdata = [];
            if (tokenObj.tokenType == "SimpleERC20") {
                argdata = [tokenObj.tokenName, tokenObj.tokenSymbol, tokenObj.address, tokenObj.tokenDecimal];
            } else if (tokenObj.tokenType == "StandardERC20" || tokenObj.tokenType == "BurnableERC20") {
                argdata = [tokenObj.tokenName, tokenObj.tokenSymbol, tokenObj.address, tokenObj.initialSupply, tokenObj.tokenDecimal];
            } else if (tokenObj.tokenType == "HelloERC20") {
                argdata = [tokenObj.tokenName, tokenObj.tokenSymbol, tokenObj.address];
            } else if (tokenObj.tokenType == "MintableERC20" || tokenObj.tokenType == "PausableERC20" || tokenObj.tokenType == "CommonERC20" || tokenObj.tokenType == "UnlimitedERC20") {
                argdata = [tokenObj.tokenName, tokenObj.tokenSymbol, tokenObj.tokenDecimal];
            } else if (tokenObj.tokenType == "AmazingERC20") {
                argdata = [tokenObj.tokenName, tokenObj.tokenSymbol];
            } else if (tokenObj.tokenType == "PowerfulERC20") {
                argdata = [tokenObj.tokenName, tokenObj.tokenSymbol];
            }
            const incrementer = new web3.eth.Contract(rowContract.contractABI);
            const incrementerTx = await incrementer.deploy({
                data: rowContract.byteCode,
                arguments: argdata
            });


            const tx = {
                from: user.username,
                data: incrementerTx.encodeABI(),
                gas: '2DC6C0'

            }

            const receipt = await window.ethereum.request({
                method: "eth_sendTransaction",
                params: [tx]
            })
           
            const receipt1 = await web3.eth.getTransactionReceipt(receipt.toString());
           

            returnData = { "data": receipt, "error": null };
            return returnData;

         


        } catch (ex) {
            returnData = { "data": null, "error": ex };

        } finally {
            return returnData;
        }
    };
    const addToken = async (event) => {
        if (btnRef.current) {
            btnRef.current.setAttribute("disabled", true);
        }
        setLoading(!isloading);

        if (user.isMetamask) {
            let featuresdtls = {
                varifySource: tokenDtl.setTokenDetails["varifySource"],
                removeCopy: tokenDtl.setTokenDetails["removeCopy"],
                burnable: tokenDtl.setTokenDetails["burnable"],
                mintable: tokenDtl.setTokenDetails["mintable"],
                erc: tokenDtl.setTokenDetails["erc"],
                tokenRecover: tokenDtl.setTokenDetails["tokenRecover"]
            }

            let reqObj = {
                method: "GET",
                headers: { "authorization": `Bearer ${user.token}` },
                url: `${USER_BASE_URL}/${GET_CONTRACT_VALUE}/${tokenDtl.setTokenDetails["tokenType"]}`,

            };

            const resp = await globalService(reqObj);

            if (resp != null) {
                let reqObj = {
                    tokenName: tokenDtl.setTokenDetails["tokenName"],
                    tokenSymbol: tokenDtl.setTokenDetails["tokenSymbol"],
                    tokenType: tokenDtl.setTokenDetails["tokenType"],
                    address: tokenDtl.setTokenDetails["address"],
                    tokenDecimal: tokenDtl.setTokenDetails["tokenDecimal"],
                }

                var deployResp = await deploy(tokenDtl.setTokenDetails, resp);

                tokenDtl.setTokenDetails["txHash"] = deployResp.data;
                tokenDtl.setTokenDetails["contractAddress"] = account;
                tokenDtl.setTokenDetails["reason"] = deployResp.error != null ? deployResp.error.message : deployResp.error;
                if (deployResp.error != null) {
                    tokenDtl.setTokenDetails["status"] = "Pending";
                } else {
                    tokenDtl.setTokenDetails["status"] = "Deployed";
                }
                tokenDtl.setTokenDetails["deployViaMetamask"] = true;
            }
        } else {
            tokenDtl.setTokenDetails["status"] = "Pending";
            tokenDtl.setTokenDetails["deployViaMetamask"] = false;
        }
        var tempdata = tokenDtl.setTokenDetails;
        var config = {
            method: "POST",
            headers: { "authorization": `Bearer ${user.token}` },
            url: `${USER_BASE_URL}/${CREATE_TOKEN_URL}`,
            data: { ...tempdata },
        };

        try {

            const resp = await globalService(config);
            if (resp.status == 0) {
                sessionStorage.clear();
                navigate("/");
            } else {
                setLoading(false);
                btnRef.current.removeAttribute("disabled", true);
                if (resp.status == '2') {
                    toast.error(resp.msg);
                } else {
                    if (deployResp && deployResp.error != null) {
                        toast.error(resp.msg);
                    } else {
                        toast.success(resp.msg);
                    }
                   
                    navigate("/tokenList");
                }

            }

        } catch (err) {
            setLoading(false);
            toast.error("Token Creation Fail!")
           
        }

    };

    const LabelValueComponent = ({ label, value }) => {
        return (
            <div className='grid grid-cols-3'>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-300">{`${label} :`}</span>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-300 truncate" >{value}</span>
            </div>
        )
    }

    return (
        <>
            {tokenDtl.setTokenDetails &&

                <div className='w-full flex flex-col md:flex-row'>
                    <div className="w-full md:w-1/2 mr-6 p-4 bg-white rounded-lg border border-gray-200 shadow-md sm:p-6 lg:p-8 dark:bg-gray-800 dark:border-gray-700 ">
                        <h5 className="text-center text-xl font-medium text-gray-900 dark:text-white">Token Details</h5>
                        <div className="form-check flex items-baseline mt-4">
                            <div>
                                <LabelValueComponent label='Token Name' value={tokenDtl.setTokenDetails.tokenName} />
                                <LabelValueComponent label='Token Symbol' value={tokenDtl.setTokenDetails.tokenSymbol} />
                                <LabelValueComponent label='Token Decimal' value={tokenDtl.setTokenDetails.tokenDecimal} />
                                <LabelValueComponent label='Initial Supply' value={tokenDtl.setTokenDetails.initialSupply} />


                                <LabelValueComponent label='Token Supply' value={tokenDtl.setTokenDetails.tokenSupply} />
                                <LabelValueComponent label='Supply Type' value={tokenDtl.setTokenDetails.supplyType} />
                                <LabelValueComponent label='Access Type' value={tokenDtl.setTokenDetails.accessType} />
                                <LabelValueComponent label='Transfer Type' value={tokenDtl.setTokenDetails.transferType} />
                                <LabelValueComponent label='Varify Source' value={tokenDtl.setTokenDetails.varifySource ? "Enabled" : "Disabled"} />
                                <LabelValueComponent label='Remove Copy' value={tokenDtl.setTokenDetails.removeCopy ? "Enabled" : "Disabled"} />


                                <LabelValueComponent label='Burnable' value={tokenDtl.setTokenDetails.burnable ? "Enabled" : "Disabled"} />
                                <LabelValueComponent label='Mintable' value={tokenDtl.setTokenDetails.mintable ? "Enabled" : "Disabled"} />
                                <LabelValueComponent label='ERC' value={tokenDtl.setTokenDetails.erc ? "Enabled" : "Disabled"} />
                                <LabelValueComponent label='Token Type ' value={tokenDtl.setTokenDetails.tokenType} />
                                <LabelValueComponent label='Network' value={tokenDtl.setTokenDetails.network} />
                                <LabelValueComponent label='Commision Fee ' value={tokenDtl.setTokenDetails.commisionFee} />
                                <LabelValueComponent label='Gas Fee' value={tokenDtl.setTokenDetails.gasFee} />
                                <LabelValueComponent label='Subscription Fee' value={tokenDtl.setTokenDetails.subscriptionFee} />

                            </div>

                        </div>
                    </div>

                    <div className='w-full mt-2 md:mt-0 md:w-1/2'>
                        <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-md sm:p-6 lg:p-8 dark:bg-gray-800 dark:border-gray-700">
                            <h5 className="text-center text-xl font-medium text-gray-900 dark:text-white">Billing Details</h5>
                            <div className="form-check flex items-baseline mt-4">
                                <div>
                                    <LabelValueComponent label='Billing Address' value={tokenDtl.setTokenDetails.billingDetails.billingAddress} />
                                    <LabelValueComponent label='Wallet Address' value={tokenDtl.setTokenDetails.billingDetails.walletAddress} />
                                    <LabelValueComponent label='Legal Name' value={tokenDtl.setTokenDetails.billingDetails.legalName} />
                                    <LabelValueComponent label='Email Id' value={tokenDtl.setTokenDetails.billingDetails.emailid} />

                                    <LabelValueComponent label='Country/Region' value={tokenDtl.setTokenDetails.billingDetails.countryName} />
                                    <LabelValueComponent label='State/Province' value={tokenDtl.setTokenDetails.billingDetails.state} />
                                    <LabelValueComponent label='City' value={tokenDtl.setTokenDetails.billingDetails.city} />
                                    <LabelValueComponent label='ZIP/Postal Code' value={tokenDtl.setTokenDetails.billingDetails.zipCode} />
                                    <LabelValueComponent label='Tax ID Code' value={tokenDtl.setTokenDetails.billingDetails.taxId} />
                                    <LabelValueComponent label='VAT/Tax Registration Number' value={tokenDtl.setTokenDetails.billingDetails.taxRegNumber} />
                                </div>
                            </div>

                        </div>

                        <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200 shadow-md sm:p-6 lg:p-8 dark:bg-gray-800 dark:border-gray-700">
                            <h5 className="text-center text-xl font-medium text-gray-900 dark:text-white">Agreement</h5>
                            <div className="form-check flex items-baseline mt-4">
                                <input type="checkbox" className='mr-2' value="" id="flexCheckChecked" checked={checked} onChange={handleCheckboxChange} />
                                <label className="form-check-label inline-block text-gray-800" for="flexCheckChecked">
                                    I have read, understood and agreed to Token Generator's Terms of Use.
                                </label>
                            </div>
                            {showError && <div className="block mb-2 text-sm font-medium text-red-900 dark:text-red-300">Fill All Required Details.</div>}
                            {isloading ? <div className="cover-spin flex justify-center items-center">

                                <Loader type={'spinningBubbles'} color="#ed8936">

                                </Loader>

                            </div>
                                :
                                <button ref={btnRef} onClick={addToken} disabled={!checked || showError}
                                    type='submit'
                                    className={`w-full bg-orange-500 hover:bg-orange-800 text-white font-bold py-2 px-4 rounded mt-9 ${ !checked || showError ? "bg-gray-300 cursor-not-allowed" : "bg-orange-500 "}`}
                                >
                                    Confirm

                                </button>
                            }
                        </div>
                    </div>
                </div>

            }

        </>
    )
}