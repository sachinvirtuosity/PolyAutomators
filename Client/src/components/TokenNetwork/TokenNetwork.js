import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMetaMask } from "metamask-react";
import Select from 'react-select'
import Transaction from '../Transaction'





export default function TokenNetwork(tokendtl) {
    const { account, ethereum, chainId } = useMetaMask();
    const navigate = useNavigate();
    const btnRef = useRef();
    const tokenTypeItems = [

        { value: "simple", label: "SimpleERC20" },
        { value: "hello", label: "HelloERC20" },
        { value: "standard", label: "StandardERC20" },
        { value: "burnable", label: "BurnableERC20" },
        { value: "mintable", label: "MintableERC20" },
        { value: "pausable", label: "PausableERC20" },
        { value: "common", label: "CommonERC20" },
        { value: "unlimited", label: "UnlimitedERC20" },
    
    ];

    const networkItems = [

        { value: "Polygon", label: "Polygon", chainId: "0x89" },
        { value: "Polygon Testnet", label: "Polygon Testnet", chainId: "0x13881" },
    ];

    var index = networkItems.findIndex(item => item.chainId == chainId);

    if (index == -1) {
        index = 1;
    }

    const [tokenType, setTokenType] = useState(tokenTypeItems[0])
    const [network, setNetwork] = useState(networkItems[index])
    const [checked, setChecked] = useState(false);
    const [txn, setTxn] = useState(null);
    const [inputtxn, setInputTxn] = useState([tokenType, network,tokendtl]);
    const [isloading, setLoading] = useState(false);
    const user = JSON.parse(sessionStorage.getItem("user"));

    const handleCheckboxChange = () => setChecked(!checked);

    const getTransaction = (txnDetails) => {
       
        setTxn(txnDetails);
        if (tokendtl.setTokenDetails != null) {
            tokendtl.setTokenDetails["gasFee"] = txn.gasFee;
            tokendtl.setTokenDetails["subscriptionFee"] = txnDetails.subscriptionFee;
            tokendtl.setTokenDetails["commisionFee"] = txnDetails.commisionFee;
            tokendtl.setTokenDetails["showBilling"] = txnDetails.showBilling;
           
        }

    }
    const setTransaction = () => {
       
        setInputTxn([tokenType, network,tokendtl]);

    }
    const changeNetworks = (values) => {
       

        ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: values.chainId }]
        }).then(() => {
            setNetwork(values);
        }).catch(() => {
            var index = networkItems.findIndex(item => item.chainId == chainId);
            if (index == -1) {
                index = 4;
            }
            setNetwork(networkItems[index]);
        })
    }
    useEffect(async () => {

        setTransaction();
   
        if (tokendtl != null) {
            tokendtl.settokentp(tokenType.label);
        }


    }, [tokenType, network,tokendtl.setTokenDetails]);
    if (tokendtl.setTokenDetails != null) {
        tokendtl.setTokenDetails["tokenType"] = tokenType.label;
        tokendtl.setTokenDetails["network"] = network.label;
        tokendtl.setTokenDetails["userName"] = user.username;
        tokendtl.setTokenDetails["createdBy"] = user.username;
    };


    return (
        <React.Fragment>
            <div className="w-50 md:w-full mt-5 ">
                <div className='bg-white rounded-lg border border-gray-200 shadow-md p-2 sm:p-4 lg:p-6 dark:bg-gray-800 dark:border-gray-700'>
                    <form >
                        <h5 className="text-xl font-medium text-center text-gray-900 dark:text-white">Token Type and Network</h5>
                        <br />
                        <div>
                            <label for="tokentype" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Token Type
                                <span className="text-red-600">*</span></label>
                            <Select
                                defaultValue={tokenTypeItems[0]}
                                value={tokenType}
                                options={tokenTypeItems}
                                onChange={(value) => setTokenType(value)}
                                classNamePrefix='supply-type'
                                className='text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'
                                components={{
                                    IndicatorSeparator: () => null
                                }}
                                inputProps={{ autoComplete: 'off', autoCorrect: 'off', spellCheck: 'off', Searchable: 'on' }}
                            />
                            <p className='my-1 clear-both text-xs text-gray-400'>Choose your Token Type.</p>
                        </div>
                        <div>
                            <label for="network" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Network
                                <span className="text-red-600">*</span></label>
                            <Select

                                options={networkItems}
                                value={network}
                                onChange={value => changeNetworks(value)}
                                classNamePrefix='network-type'
                                className='text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'
                                components={{
                                    IndicatorSeparator: () => null
                                }}
                                inputProps={{ autoComplete: 'off', autoCorrect: 'off', spellCheck: 'off', Searchable: 'on' }}
                            />
                            <p className='my-1 clear-both text-xs text-gray-400'>Choose your Network.</p>
                        </div>
                    </form>
                </div>

                <Transaction setTransaction={inputtxn} getTransaction={getTransaction} />

            </div>
        </React.Fragment>
    )
}