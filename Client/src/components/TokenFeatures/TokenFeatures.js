import React, { useState, useEffect } from 'react'
import Select from 'react-select'
import './tokenfeatures.scss';

export default function TokenFeatures(tokendtl) {

    const suppyTypeItems = [
        { value: "10k", label: "10K" },
        { value: "fixed", label: "Fixed" },
        { value: "unlimited", label: "Unlimited" },
        { value: "capped", label: "Capped" },
    ];

    const accessTypeItems = [
        { value: "none", label: "None" },
        { value: "ownable", label: "Ownable" },
        { value: "role", label: "Role Based" },
    ];

    const transferTypeItems = [
        { value: "unstoppable", label: "Unstoppable" },
        { value: "pausable", label: "Pausable" }
    ];
    const [supplyType, setSupplyType] = useState(suppyTypeItems[1]);
    const [accessType, setAccessType] = useState(accessTypeItems[0]);
    const [isVarifySource, setisVarifySource] = useState(true);
    const [isRemoveCopy, setisRemoveCopy] = useState(false);

    const [isBurnable, setisBurnable] = useState(false);
    const [isMintable, setisMintable] = useState(false);
    const [isErc, setisErc] = useState(false);
    const [isTokenRecover, setisTokenRecover] = useState(false);


    const [transferType, setTransferType] = useState(transferTypeItems[0]);
    const [checked, setChecked] = useState(true);
    const [isDisabled, setisDisabled] = useState(false);
    const [tokenType, setTokenType] = useState()
    const [tokendt, settokens] = useState(tokendtl);

    useEffect(() => {

        let index = suppyTypeItems.findIndex(item => item.label == "Fixed");
        setSupplyType(suppyTypeItems[index])
        let accIndex = accessTypeItems.findIndex(item => item.label == "None");
        let transIndex = transferTypeItems.findIndex(item => item.label == "Unstoppable")
        setAccessType(accessTypeItems[accIndex]);
        setTransferType(transferTypeItems[transIndex]);
        setisDisabled(true);
        setisVarifySource(true);
        setisErc(false);
        setisTokenRecover(false);
        if (tokendtl.tokentp == "SimpleERC20") {

            setisRemoveCopy(false);
            setisBurnable(false);
            setisMintable(false);

        } else if (tokendtl.tokentp == "HelloERC20") {
            index = suppyTypeItems.findIndex(item => item.label == "10K");
            setSupplyType(suppyTypeItems[index])
            setisRemoveCopy(false);
            setisBurnable(false);
            setisMintable(false);
        } else if (tokendtl.tokentp == "StandardERC20") {
            setisRemoveCopy(true);
            setisBurnable(false);
            setisMintable(false);

        } else if (tokendtl.tokentp == "BurnableERC20") {
            setisRemoveCopy(true);
            setisBurnable(true);
            setisMintable(false);

        } else if (tokendtl.tokentp == "MintableERC20") {
            let index = suppyTypeItems.findIndex(item => item.label == "Capped");
            setSupplyType(suppyTypeItems[index]);
            accIndex = accessTypeItems.findIndex(item => item.label == "Ownable");
            setAccessType(accessTypeItems[accIndex]);
            setisRemoveCopy(true);
            setisBurnable(false);
            setisMintable(true);

        } else if (tokendtl.tokentp == "PausableERC20") {
            accIndex = accessTypeItems.findIndex(item => item.label == "Ownable");
            setAccessType(accessTypeItems[accIndex]);
            transIndex = transferTypeItems.findIndex(item => item.label == "Pausable")
            setTransferType(transferTypeItems[transIndex]);
            setisRemoveCopy(true);
            setisBurnable(true);
            setisMintable(false);
        } else if (tokendtl.tokentp == "CommonERC20") {
            let index = suppyTypeItems.findIndex(item => item.label == "Capped");
            setSupplyType(suppyTypeItems[index]);
            accIndex = accessTypeItems.findIndex(item => item.label == "Ownable");
            setAccessType(accessTypeItems[accIndex]);
            setisRemoveCopy(true);
            setisBurnable(true);
            setisMintable(true);

        } else if (tokendtl.tokentp == "UnlimitedERC20") {
            let index = suppyTypeItems.findIndex(item => item.label == "Unlimited");
            setSupplyType(suppyTypeItems[index]);
            accIndex = accessTypeItems.findIndex(item => item.label == "Role Based");
            setAccessType(accessTypeItems[accIndex]);
            setisRemoveCopy(true);
            setisBurnable(true);
            setisMintable(true);

        } else if (tokendtl.tokentp == "AmazingERC20") {
            let index = suppyTypeItems.findIndex(item => item.label == "Unlimited");
            setSupplyType(suppyTypeItems[index]);
            accIndex = accessTypeItems.findIndex(item => item.label == "Ownable");
            setAccessType(accessTypeItems[accIndex]);
            setisRemoveCopy(true);
            setisBurnable(true);
            setisMintable(true);
            setisErc(true);
            setisTokenRecover(true);

        } else if (tokendtl.tokentp == "PowerfulERC20") {
            let index = suppyTypeItems.findIndex(item => item.label == "Capped");
            setSupplyType(suppyTypeItems[index]);
            accIndex = accessTypeItems.findIndex(item => item.label == "Role Based");
            setAccessType(accessTypeItems[accIndex]);
            setisRemoveCopy(true);
            setisBurnable(true);
            setisMintable(true);
            setisErc(true);
            setisTokenRecover(true);

        }

        if (tokendtl.setTokenDetails != null) {
            tokendtl.setTokenDetails["varifySource"] = isVarifySource;
            tokendtl.setTokenDetails["removeCopy"] = isRemoveCopy;
            tokendtl.setTokenDetails["burnable"] = isBurnable;
            tokendtl.setTokenDetails["erc"] = isErc;
            tokendtl.setTokenDetails["mintable"] = isMintable;
            tokendtl.setTokenDetails["tokenRecover"] = isTokenRecover;
        }


    }, [tokendtl.tokentp])

    if (tokendtl.setTokenDetails != null) {
        tokendtl.setTokenDetails["supplyType"] = supplyType.label;
        tokendtl.setTokenDetails["accessType"] = accessType.label;
        tokendtl.setTokenDetails["transferType"] = transferType.label;



    }
    const handleCheckboxChange = (e, key) => {
        tokendtl.setTokenDetails[key] = e.target.checked;

    };



    return (
        <div className="w-50 md:mx-3 md:w-full mt-5 bg-white rounded-lg border border-gray-200 shadow-md p-2 sm:p-4 lg:p-6 dark:bg-gray-800 dark:border-gray-700">
            <form autocomplete="off">
                <h5 className="text-xl font-medium text-center text-gray-900 dark:text-white">Token Features</h5>
                <br />
                <div>
                    <label for="supplyType" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Supply Type</label>
                    <Select
                        isDisabled={isDisabled}
                        value={supplyType}
                        options={suppyTypeItems}
                        onChange={value => setSupplyType(value)}
                        classNamePrefix='supply-type'
                        className='text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'
                        components={{
                            IndicatorSeparator: () => null
                        }}

                        inputProps={{ autoComplete: 'off', autoCorrect: 'off', spellCheck: 'off', Searchable: 'on' }}
                    />
                    <p className='my-1 clear-both text-xs text-gray-400'>10k, Fixed, Unlimited, Capped</p>
                </div>
                <div>
                    <label for="accessType" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Access Type</label>
                    <Select
                        value={accessType}
                        options={accessTypeItems}
                        onChange={value => setAccessType(value)}
                        classNamePrefix='supply-type'
                        className='text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'
                        components={{
                            IndicatorSeparator: () => null
                        }}
                        isDisabled={isDisabled}
                        inputProps={{ autoComplete: 'off', autoCorrect: 'off', spellCheck: 'off', Searchable: 'on' }}
                    />
                    <p className='my-1 clear-both text-xs text-gray-400'>None, Ownable, Role Based</p>
                </div>
                <div>
                    <label for="transferType" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Transfer Type</label>
                    <Select
                        value={transferType}
                        options={transferTypeItems}
                        onChange={value => setTransferType(value)}
                        classNamePrefix='supply-type'
                        className='text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'
                        components={{
                            IndicatorSeparator: () => null
                        }}
                        isDisabled={isDisabled}
                        inputProps={{ autoComplete: 'off', autoCorrect: 'off', spellCheck: 'off', Searchable: 'on' }}
                    />
                    <p className='my-1 clear-both text-xs text-gray-400'>Unstoppable, Pausable</p>
                </div>
                <div className="flex flex-col my-1">
                    <div className="form-check form-switch pl-0">
                        <input
                            disabled={isDisabled}
                            className="ml-0 form-check-input appearance-none w-9 mr-3 rounded-full float-left h-5 align-top bg-white bg-no-repeat bg-contain bg-gray-300 focus:outline-none cursor-pointer shadow-sm"
                            type="checkbox"
                            role="switch"
                            id="flexSwitchCheckChecked"
                            checked={isVarifySource}
                            onChange={(e) => { handleCheckboxChange(e, "varifySource") }} />
                        <label className="clear-both form-check-label inline-block text-gray-800" for="flexSwitchCheckChecked">Verified Source Code</label>
                    </div>
                    <p className='my-1 clear-both text-xs text-gray-400'>Your Token Source Code will be automatically verified on Etherscan.</p>
                </div>
                <div className="flex flex-col my-1">
                    <div className="form-check form-switch pl-0">
                        <input disabled={isDisabled} className="ml-0 form-check-input appearance-none w-9 mr-3 rounded-full float-left h-5 align-top bg-white bg-no-repeat bg-contain bg-gray-300 focus:outline-none cursor-pointer shadow-sm" type="checkbox" role="switch" id="flexSwitchCheckChecked" checked={isRemoveCopy} onChange={(e) => { handleCheckboxChange(e, "removeCopy") }} />
                        <label className="clear-both form-check-label inline-block text-gray-800" for="flexSwitchCheckChecked">Remove Copyright</label>
                    </div>
                    <p className='my-1 clear-both text-xs text-gray-400'>Remove the link pointing to this page from your contract.</p>
                </div>
                <div className="flex flex-col my-1">
                    <div className="form-check form-switch pl-0">
                        <input disabled={isDisabled} className="ml-0 form-check-input appearance-none w-9 mr-3 rounded-full float-left h-5 align-top bg-white bg-no-repeat bg-contain bg-gray-300 focus:outline-none cursor-pointer shadow-sm" type="checkbox" role="switch" id="flexSwitchCheckChecked" checked={isBurnable} onChange={(e) => { handleCheckboxChange(e, "burnable") }} />
                        <label className="clear-both form-check-label inline-block text-gray-800" for="flexSwitchCheckChecked">Burnable</label>
                    </div>
                </div>
                <div className="flex flex-col my-1">
                    <div className="form-check form-switch pl-0">
                        <input disabled={isDisabled} className="ml-0 form-check-input appearance-none w-9 mr-3 rounded-full float-left h-5 align-top bg-white bg-no-repeat bg-contain bg-gray-300 focus:outline-none cursor-pointer shadow-sm" type="checkbox" role="switch" id="flexSwitchCheckChecked" checked={isMintable} onChange={(e) => { handleCheckboxChange(e, "mintable") }} />
                        <label className="clear-both form-check-label inline-block text-gray-800" for="flexSwitchCheckChecked">Mintable</label>
                    </div>
                </div>
                <div className="flex flex-col my-1">
                    <div className="form-check form-switch pl-0">
                        <input disabled={isDisabled} className="ml-0 form-check-input appearance-none w-9 mr-3 rounded-full float-left h-5 align-top bg-white bg-no-repeat bg-contain bg-gray-300 focus:outline-none cursor-pointer shadow-sm" type="checkbox" role="switch" id="flexSwitchCheckChecked" checked={isErc} onChange={(e) => { handleCheckboxChange(e, "erc") }} />
                        <label className="clear-both form-check-label inline-block text-gray-800" for="flexSwitchCheckChecked">ERC1363</label>
                    </div>
                </div>
                <div className="flex flex-col my-1">
                    <div className="form-check form-switch pl-0">
                        <input disabled={isDisabled} className="ml-0 form-check-input appearance-none w-9 mr-3 rounded-full float-left h-5 align-top bg-white bg-no-repeat bg-contain bg-gray-300 focus:outline-none cursor-pointer shadow-sm" type="checkbox" role="switch" id="flexSwitchCheckChecked" checked={isTokenRecover} onChange={(e) => { handleCheckboxChange(e, "tokenRecover") }} />
                        <label className="clear-both form-check-label inline-block text-gray-800" for="flexSwitchCheckChecked">Token Recover</label>
                    </div>
                </div>
            </form>
        </div>
    )
}