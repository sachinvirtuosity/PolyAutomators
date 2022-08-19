import React, { useState, useRef } from 'react';
import GetDisctributeToken from "../../components/GetDisctributeToken";
import DistributionSummery from "../../components/DistributionSummery";
import ChangeNetwork from "../../components/ChangeNetwork";
export default function DistributeToken() {
    const [tokenList, setFinalTokenList] = useState(null);
    const [contractAddress, setContractAddress] = useState("");
    console.log(contractAddress);
    return (
        <>
            <p className='text-2xl font-medium'>Distribute Token</p>
            <ChangeNetwork></ChangeNetwork>
            {tokenList == null ?
                <GetDisctributeToken setFinalTokenList={setFinalTokenList} setContractAddress={setContractAddress} />
                :
                <DistributionSummery tokenList={tokenList} contractAddress={contractAddress} />}
        </>
    )

}