import React, { useState, useEffect } from 'react';
import Papa from "papaparse";
import NumberedTextArea from "../NumberedTextArea"
import Loader from 'react-loading';
import { toast } from 'react-toastify';
import {
    USER_BASE_URL,
    globalService,
    GET_CONTRACT_VALUE,
    GassFeeCalculation
} from "../../helpers";
import { CreateTokenIcon } from '../../assets/SvgComponent';
const Web3 = require('web3');

export default function GetDisctributeToken({ setFinalTokenList, setContractAddress }) {
    const [tokenAddress, setTokenAddress] = useState("");
    const [tokenList, setTokenList] = useState("");
    const [errormsg, seterrormsg] = useState("");
    const [tokenerror, settokenerror] = useState("");
    const [fileUpload, setFileUpload] = useState(false);
    const [fileData, setFileData] = useState([]);
    const [isloading, setLoading] = useState(false);
    const [istxtloading, settxtLoading] = useState(false);
    const [isBtnDisable, setisBtnDisable] = useState(true);

    const web3 = new Web3(window.ethereum);
    useEffect(() => {
        if (tokenList != "" && tokenerror == "") {
            setisBtnDisable(false);
        } else {
            setisBtnDisable(true);
        }

    }, [tokenList])

    const submitToken = () => {

        setLoading(!isloading);
        setContractAddress(tokenAddress);
        if (fileUpload == false) {


            const finalTokens = [];
            let tokenArray = tokenList.split("\n");

            tokenArray.forEach((item) => {
                let eachToken = item.substring(item.indexOf(" "), item.length).split(",");
                finalTokens.push({ "tokenName": eachToken[0], "amount": eachToken[1] });
            })
            setFinalTokenList(finalTokens);

        } else {
            setFinalTokenList(fileData);
        }
        setLoading(!isloading);

    }

    const changeHandler = (event) => {
        // Passing file data (event.target.files[0]) to parse using Papa.parse
        setLoading(!isloading);
        Papa.parse(event.target.files[0], {
            header: true,
            skipEmptyLines: true,
            complete: function (results) {

                const finalTokens = [];


                seterrormsg("");


                setFileUpload(true);
                let contractAddress_regex = new RegExp('0x[a-fA-F0-9]{40}$');
                // Iterating data to get column name and their values
                if (Object.keys(results.data).length > 0) {
                    results.data.map((d) => {
                        let tokenValues = Object.values(d);

                        if (tokenValues[0].length == 0) {
                            seterrormsg("Token Address can not be empty");
                            return false;
                        } else if (!contractAddress_regex.test(tokenValues[0])) {
                            seterrormsg("Token Address can not be empty");
                            return false;
                        } else if (tokenValues[1].length == 0 || isNaN(tokenValues[1])) {
                            seterrormsg("Invalid amount.");
                            return false;
                        } else {
                            finalTokens.push({ "tokenName": tokenValues[0], "amount": tokenValues[1] });
                        }


                    });
                    if (finalTokens.length > 0 && errormsg == "") {
                        setFileData(finalTokens);
                        if (tokenerror == "") {
                            setisBtnDisable(false)
                        }

                    }
                    else {
                        setFileData(null);
                        setisBtnDisable(true)
                    }
                }

                setLoading(false);
            },
        });

    };
    const getContractAddr = async (e) => {
        settxtLoading(true);
        var newToken = e.currentTarget.value;

        let contractAddress_regex = new RegExp('0x[a-fA-F0-9]{40}$');
        if (newToken == "") {
            settokenerror("Token Address Required");
            setisBtnDisable(true);
        } else if (!contractAddress_regex.test(newToken)) {
            settokenerror("Required Valid Token Address");
            setisBtnDisable(true);
        } else {

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
                    contractAddress: newToken,
                    addressList: ['0x01f4e9CeF4138A87f4a24023bAAae00729b32185'],
                    amountList: [200],
                    account: '0x01f4e9CeF4138A87f4a24023bAAae00729b32185',
                    methodName: "airdropByOwner"

                }
                GassFeeCalculation(reqObj).then((gassvalue) => {
                    settokenerror("");
                }).catch((ex) => {

                    settokenerror("Invalid Contract Address");

                })



            }
        }
        setTokenAddress(newToken);
        settxtLoading(false);
    }

    return (
        <>  <div className='grid grid-row-2 md:grid-cols-2 bg-white rounded-lg mt-5 p-4'>

            <div className='row-span-1 md:col-span-1 p-6'>
                <div className='flex flex-row items-center mb-3'>
                    <div className='w-6'>
                        <CreateTokenIcon />
                    </div>
                    <p className='text-base font-light pl-2'>Token multisender dapp for all your tokens</p>
                </div>
                <div className='flex flex-row items-center mb-3'>
                    <div className='w-6'>
                        <CreateTokenIcon />
                    </div>
                    <p className='text-base font-light pl-2'>Send your tokens to multiple recipients efficiently</p>
                </div>
                <div className='flex flex-row items-center mb-3'>
                    <div className='w-6'>
                        <CreateTokenIcon />
                    </div>
                    <p className='text-base font-light pl-2'>Send stable coins or cryptocurrency for dividend or coupon payment end stable coins or cryptocurrency for dividend or coupon paymentss</p>
                </div>
                <div className='flex flex-row items-center mb-3'>
                    <div className='w-6'>
                        <CreateTokenIcon />
                    </div>
                    <p className='text-base font-light pl-2'>Input list of addresses and amounts manually</p>
                </div>
                <div className='flex flex-row items-center mb-3'>
                    <div className='w-6'>
                        <CreateTokenIcon />
                    </div>
                    <p className='text-base font-light pl-2'>Distribute automatically via CSV upload (download a holder snapshot like here)</p>
                </div>
            </div>
            <div className="row-span-1 md:col-span-1 w-full my-6 max-w-sm bg-white rounded-lg border border-gray-200 shadow-md p-2 sm:p-4 lg:p-6 dark:bg-gray-800 dark:border-gray-700 mx-auto">

                <div>
                    <label for="tokanAddress" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                        Token<span className="text-red-600">*</span></label>
                    <input
                        type="text"
                        name="tokanAddress"
                        id="tokanAddress"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        placeholder="Contract Address"
                        onChange={(e) => {
                            getContractAddr(e)
                        }}
                        required
                    />
                    {tokenerror != "" && <div className="block mb-2 text-sm font-medium text-red-900 dark:text-red-300">{tokenerror}</div>}
                    {istxtloading && <div className="cover-spin flex justify-center items-center">

                        <Loader type={'spinningBubbles'} color="#ed8936">

                        </Loader>

                    </div>}
                </div>

                {(tokenAddress != "" && tokenerror == "") && <div className="intro-x text-center xl:text-left">
                    <div>
                        <input
                            type="file"
                            name="file"
                            onChange={changeHandler}
                            accept=".csv"
                            style={{ display: "block", margin: "10px auto" }}
                        />
                    </div>

                    <div>
                        <label for="tokanAddress" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"><span className="text-red-300">*</span> Insert manually</label>
                        <NumberedTextArea setTokenList={setTokenList} />
                    </div>
                    {isloading ? <div className="cover-spin"><Loader type={'spinningBubbles'} color={"#38b2ac"} height={60} width={60} ></Loader></div> : <div></div>}
                    {errormsg != "" && <div className="block mb-2 text-sm font-medium text-red-900 dark:text-red-300">{errormsg}</div>}
                    {isloading ? <div className="cover-spin flex justify-center items-center">

                        <Loader type={'spinningBubbles'} color="#ed8936">

                        </Loader>

                    </div> :
                        <button type='submit' className={`w-full bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-2 rounded mt-9 ${isBtnDisable ? "bg-gray-300 cursor-not-allowed" : "bg-orange-500 "}`} onClick={submitToken} disabled={isBtnDisable}>
                            Continue
                        </button>
                    }



                </div>}
            </div>
        </div>
        </>
    )

}