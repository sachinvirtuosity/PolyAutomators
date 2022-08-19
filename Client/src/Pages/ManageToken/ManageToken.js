import React, { useState } from 'react'
import TokenAddress from "../../components/TokenAddress"
import TokenAddressDetails from "../../components/TokenAddressDetails"
import ChangeNetwork from "../../components/ChangeNetwork";
export default function ManageToken() {
    const [tokenaddr, setTokenAddress] = useState();

    const getTokenAddress = (details) => {
        setTokenAddress(details);


    }
    return (
        <div>
            <p className='text-2xl font-medium'>Manage your tokens</p>
            <ChangeNetwork />
            {tokenaddr == undefined || tokenaddr == null ?
                <TokenAddress getTokenAddress={getTokenAddress} />
                :
                <TokenAddressDetails tokenaddr={tokenaddr} />
            }

        </div>
    )
}