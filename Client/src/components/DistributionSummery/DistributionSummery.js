import FeatherIcon from "feather-icons-react";
import { useEffect, useState } from "react";
import { useMetaMask } from "metamask-react";
import Loader from 'react-loading';
import { toast } from 'react-toastify';
const Web3 = require('web3');
import {
    USER_BASE_URL,
    globalService,
    GET_CONTRACT_VALUE,
    GassFeeCalculation
} from "../../helpers";
import abi from '../../../contracts/build/contracts/abi.json';
import SummaryLabelValue from "../SummaryLabelValue/SummaryLabelValue";
const web3 = new Web3(window.ethereum);

export default function DistributionSummery({ tokenList, contractAddress }) {
    const { account } = useMetaMask();
    const [accountBalance, setAcctBal] = useState("");
    const [contractBalance, setContractBal] = useState("");
    const [symbol, setSymbol] = useState("");
    const [networkType, setNetworkType] = useState("standard")
    const [txHash, setTxhash] = useState("");
    const [gassvalue, setgassvalue] = useState("");
    const [tokens, settokens] = useState([]);
    const [isloading, setLoading] = useState(false);
    const [isbtnDelete, setbtnDelete] = useState(false);

    useEffect(async () => {
        settokens(tokenList);
        if (tokenList.length > 1) {
            setbtnDelete(true);
        } else {
            setbtnDelete(false);
        }
    }, [tokenList])
    useEffect(async () => {
        if (contractAddress != "") {
            const acbal = await web3.eth.getBalance(account);
            setAcctBal(acbal / Math.pow(10, 18));
            const user = JSON.parse(sessionStorage.getItem("user"));
            try {
                let reqObj = {
                    method: "GET",
                    headers: { "authorization": `Bearer ${user.token}` },
                    url: `${USER_BASE_URL}/${GET_CONTRACT_VALUE}/erc20Airdrop`,

                };

                var resp = await globalService(reqObj);

                if (resp != null) {
                    const tokenInst = new web3.eth.Contract(resp.contractABI, contractAddress);

                    const contractBal = await tokenInst.methods.balanceOf(account).call();

                    const decimal = await tokenInst.methods.decimals().call();

                    setContractBal(contractBal / Math.pow(10, decimal));
                    const symbol = await tokenInst.methods.symbol().call();

                    setSymbol(symbol);
                    if (Object.keys(tokenList).length > 0) {

                        var addressList = [];
                        var amountList = [];

                        tokenList.map((item) => {
                            addressList.push(item.tokenName);
                            amountList.push(item.amount);
                        })

                        if (resp != null) {
                            let reqObj = {
                                contractABI: resp.contractABI,
                                contractAddress: contractAddress,
                                addressList: addressList,
                                amountList: amountList,
                                account: account,
                                methodName: "airdropByOwner"

                            }
                            const finalGasInEther = await GassFeeCalculation(reqObj);
                            setgassvalue(finalGasInEther);

                        }

                    }
                }
            } catch (ex) {
                console.log(ex);
            }
        }
    }, [contractAddress])
    const RemoveToken = (tokenName) => {
        let tempTokenList = tokens;
        let index = tempTokenList.findIndex((item) => { return item.tokenName == tokenName });
        if (index > -1) {
            tempTokenList.splice(index, 1);

            settokens(tempTokenList);
            if (tempTokenList.length > 1) {
                setbtnDelete(true)
            } else {
                setbtnDelete(false)
            }

        }
    }
    const handleDistribution = async () => {
        setLoading(true);
        var addressList = [];
        var amountList = [];

        tokenList.map((item) => {
            addressList.push(item.tokenName);
            amountList.push(item.amount);
        })

        const user = JSON.parse(sessionStorage.getItem("user"));
        let reqObj = {
            method: "GET",
            headers: { "authorization": `Bearer ${user.token}` },
            url: `${USER_BASE_URL}/${GET_CONTRACT_VALUE}/erc20Airdrop`,

        };

        var resp = await globalService(reqObj);

        if (resp != null) {

            let reqObj = {
                contractABI: resp.contractABI,
                contractAddress: contractAddress,
                addressList: addressList,
                amountList: amountList,
                account: account,
                methodName: "airdropByOwner"

            }
            GassFeeCalculation(reqObj).then((gassvalue) => {
                const tokenInst = new web3.eth.Contract(resp.contractABI, contractAddress);

                tokenInst.methods.airdropByOwner(addressList, amountList).send({
                    from: account, maxPriorityFeePerGas: null,
                    maxFeePerGas: null
                }, function (err, res) {
                    if (err) {

                        setTxhash("");
                    } else {

                        setTxhash(res);
                    }

                    setLoading(false);
                }
                )
            }).catch((ex) => {
                console.log(ex);
                toast.error("Invalid Contract Address");
                setLoading(false);

            })




        }


    }
    return (
        <>
            {tokenList &&
                <div className="w-full my-6 bg-white rounded-lg border border-gray-200 shadow-md p-2 sm:p-4 lg:p-6 dark:bg-gray-800 dark:border-gray-700 mx-auto">


                    <div className="intro-x text-center xl:text-left">
                        <div className="form-check  items-baseline mt-4">

                            <ul className="nav nav-pills nav-justified flex flex-col md:flex-row flex-wrap list-none pl-0 mb-4"
                                id="pills-tabJustify" role="tablist">

                                <li className="nav-item flex-grow text-center my-2 md:mx-2" role="presentation">
                                    <a href="#pills-profileJustify" className="
                                
                                    nav-link
                                    w-90
                                    block
                                    font-medium
                                    text-xs
                                    leading-tight
                                    uppercase
                                    rounded
                                    px-6
                                    py-3
                                    focus:outline-none focus:ring-0
                                    " id="pills-profile-tabJustify" data-bs-toggle="pill" data-bs-target="#pills-profileJustify" role="tab"
                                        aria-controls="pills-profileJustify" aria-selected="false" onClick={() => { setNetworkType("slow") }}>Slow</a>
                                </li>
                                <li className="nav-item flex-grow text-center my-2 md:ml-2" role="presentation">
                                    <a href="#pills-contactJustify" className="
                                active
                                nav-link
                                w-90
                                block
                                font-medium
                                text-xs
                                leading-tight
                                uppercase
                                rounded
                                px-6
                                py-3
                                focus:outline-none focus:ring-0
                                " id="pills-contact-tabJustify" data-bs-toggle="pill" data-bs-target="#pills-contactJustify" role="tab"
                                        aria-controls="pills-contactJustify" aria-selected="false" onClick={() => { setNetworkType("standard") }}>Standard</a>
                                </li>
                                <li className="nav-item flex-grow text-center my-2 md:ml-2" role="presentation">
                                    <a href="#pills-contactJustify" className="
                                    nav-link
                                    w-90
                                    block
                                    font-medium
                                    text-xs
                                    leading-tight
                                    uppercase
                                    rounded
                                    px-6
                                    py-3
                                    focus:outline-none focus:ring-0
                                    " id="pills-billing-tabJustify" data-bs-toggle="pill" data-bs-target="#pills-billingJustify" role="tab"
                                        aria-controls="pills-billing-tabJustify" aria-selected="false" onClick={() => { setNetworkType("fast") }}>Fast</a>
                                </li>

                            </ul>

                            <div className="mt-9" >
                                <h5 className="text-left text-xl font-medium text-gray-900 dark:text-white"> List Of Recipients</h5>
                                {
                                    tokens.length >= 0 ?
                                        <div className='overflow-x-auto relative shadow-md sm:rounded-lg mt-4'>
                                            <table className='w-full'>
                                                <tr id="" className=' py-8 w-full mr-4'>
                                                    <th className='w-20  py-4 text-center tbl_header text-white' >Address</th>
                                                    <th className='w-20  py-4 text-center tbl_header text-white'>Amount</th>
                                                    <th className='w-20  py-4 text-center tbl_header text-white'>Remove</th>

                                                </tr>
                                                {tokens.map((val, key) => {
                                                    return (
                                                        <tr key={key} >
                                                            <td className='w-20 py-3 text-center bg-gray-200'>{val.tokenName}</td>

                                                            <td className='w-20 py-3  text-center bg-gray-200'>{val.amount}</td>

                                                            <td className='w-20 py-3  text-center bg-gray-200'>

                                                                {isbtnDelete && <a href='#' className='text-blue-500' onClick={() => { RemoveToken(val.tokenName) }}><FeatherIcon icon="trash-2" color="blue" size="20px" className="ml-6" ></FeatherIcon> </a>}

                                                            </td>

                                                        </tr>
                                                    )
                                                })}
                                            </table>
                                        </div>
                                        : null
                                }
                            </div>
                            <div className="mt-9" >
                                <hr></hr>
                                <h5 className="text-left text-xl font-medium text-gray-900 dark:text-white py-4"> Summary</h5>

                                <SummaryLabelValue label='Total number of addresses' value={Object.keys(tokenList).length} width='w-2/5' />
                                <SummaryLabelValue label='Total number of tokens to be sent' value={`${tokenList.reduce((n, { amount }) => parseInt(n) + parseInt(amount), 0)} ${symbol}`} width='w-2/5' />
                                <SummaryLabelValue label='Total number of transactions needed' value={1} width='w-2/5' />
                                <SummaryLabelValue label='Your token balance' value={`${contractBalance} ${symbol}`} width='w-2/5' />
                                <SummaryLabelValue label='Approximate cost of operation' value={`${gassvalue} ETH`} width='w-2/5' />
                                <SummaryLabelValue label='Your ETH balance' value={`${accountBalance} ETH`} width='w-2/5' />

                            </div>


                            {txHash == "" ?
                                <>
                                    {
                                        isloading ?
                                            <div className="flex justify-center items-center">
                                                < Loader type={'spinningBubbles'} color={"#ed8936"} height={60} width={60} >
                                                </Loader>
                                            </div> :
                                            <div className='flex justify-center items-center'>
                                                <button type='submit'
                                                    className="w-1/2 bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-2 rounded mt-9"
                                                    onClick={handleDistribution}>
                                                    Approve
                                                </button>
                                            </div>}
                                </>

                                :
                                <div className="text-green-600"> transactions successfull with Transaction ID <a target="_blank" href={"https://ropsten.etherscan.io/tx/" + txHash}>{txHash}</a></div>
                            }

                        </div>


                    </div>
                </div >}
        </>
    )

}