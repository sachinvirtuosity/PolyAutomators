import { useFormikContext, Formik, Form, Field, useFormik, ErrorMessage } from 'formik'
import React, { useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Select from 'react-select'




var tokenDetails = {

    "tokenName": "",
    "tokenSymbol": "",
    "tokenDecimal": "18",
    "tokenSupply": "1000",
    "initialSupply": "1000",
    "accessType": "Ownable",
    "supplyType": "Fixed",
    "tokenType": "",
    "transferType": "Unstoppable",
    "network": "",
    "varifySource": true,
    "removeCopy": false,
    "burnable": false,
    "erc": false,
    "mintable": false,
    "tokenRecover": false,
    "status": "Active",
    "commisionFee": "",
    "gasFee": "",
    "subscriptionFee": "",
    "userName": "test",
    "address": "",
    "showBilling": false,
    "billingDetails": {}
};
export default function TokenDetails({ getTokenDetails, tokentp }) {

    const { setFieldValue } = useFormikContext();
    const [submitted, setSubmitValue] = useState(false);
    const [formError, setFormError] = useState({});
    const [isDisabled, setisDisabled] = useState(false);
    const [isDisabledinitSupp, setisDisabledinitSupp] = useState(false);
    const [isDisabledTokenDeci, setisDisabledTokenDeci] = useState(false);
    const [displayAddress, setDisplayAddress] = useState(true);
    const tokenDecimalItem = [
        { value: "6", label: "6" },
        { value: "10", label: "10" },
        { value: "18", label: "18" },
    ];
    const [tokenDecimal, setTokenDecimal] = useState(tokenDecimalItem[2]);

    useEffect(() => {

        if (tokentp != null) {
            setTokenDecimal(tokenDecimalItem[2]);
            setFieldValue("initialSupply", 1000);
            setFieldValue("tokenSupply", 1000);
            if (tokentp == "SimpleERC20") {
                setisDisabled(true);
                setisDisabledinitSupp(false);
                setisDisabledTokenDeci(true);
            } else if (tokentp == "HelloERC20") {
                setisDisabled(true);
                setisDisabledinitSupp(true);
                setisDisabledTokenDeci(true);
            } else if (tokentp == "StandardERC20" || tokentp == "BurnableERC20" || tokentp == "PausableERC20") {
                setisDisabled(true);
                setisDisabledinitSupp(false);
                setisDisabledTokenDeci(false);
            } else if (tokentp == "MintableERC20" || tokentp == "CommonERC20" || tokentp == "UnlimitedERC20" || tokentp == "AmazingERC20" || tokentp == "PowerfulERC20") {
                setisDisabled(false);
                setisDisabledinitSupp(false);
                setisDisabledTokenDeci(false);

            }

            if (tokentp == "UnlimitedERC20" || tokentp == "AmazingERC20") {
                tokenDetails["tokenSupply"] = "";
                setFieldValue("tokenSupply", "");
            } else {
                tokenDetails["tokenSupply"] = tokenDetails["initialSupply"];
                setFieldValue("tokenSupply", tokenDetails["initialSupply"]);
            }

            if (tokentp != "SimpleERC20" && tokentp != "StandardERC20" && tokentp != "BurnableERC20" && tokentp != "HelloERC20") {
                setDisplayAddress(false);
                if (Object.keys(formError).length > 0) {
                    if (("address" in formError)) {
                        setFormError(delete formError.address);
                        varifydata();
                    }
                }
            } else {
                setDisplayAddress(true);
                if (tokenDetails.address == "") {
                    setFormError({ address: 'Minter Address Required' });
                    tokenDetails.validForm = false;
                    varifydata();
                }
            }
        }
    }, [tokentp])
    const onInputChange = async (e, key) => {
        if (key == "tokenDecimal") {
            setTokenDecimal(e);
            tokenDetails[key] = e.value;
        } else {
            const { value } = e.currentTarget;
            setFieldValue(key, value);
            tokenDetails[key] = value;
            if (tokentp != null && key == "initialSupply") {

                if (tokentp != "UnlimitedERC20" && tokentp != "AmazingERC20") {
                    tokenSupply.value = value;
                    tokenDetails["tokenSupply"] = value;
                    setFieldValue("tokenSupply", value);
                } else {
                    tokenDetails["tokenSupply"] = "";
                    setFieldValue("tokenSupply", "");
                }

            }
        }


        setSubmitValue(true);
        setFormError(validate(tokenDetails));
    }

    const validate = (values) => {
        let alp_regex = new RegExp('[a-zA-Z]');
        let errors = {};
        if (!values.tokenName) {
            errors.tokenName = 'Token Name Required';
        }
        if (!values.tokenSymbol) {
            errors.tokenSymbol = 'Token Symbol Required';
        } else if ((values.tokenSymbol).toString().length >= 6) {
            errors.tokenSymbol = "Token Symbol should contain max 5 characters"
        } else if (!alp_regex.test(values.tokenSymbol)) {
            errors.tokenSymbol = "Token Symbol should contain alphabets Only"
        }
        if (!values.initialSupply) {
            errors.initialSupply = 'Initial supply Required';
        } else if (isNaN(parseInt(values.initialSupply))) {
            errors.initialSupply = 'Initial supply should contain Numbers Only';
        } else if (parseInt(values.initialSupply) <= 0) {
            errors.initialSupply = 'Initial supply Should be more than 1';
        }
        if (tokentp != "UnlimitedERC20" && tokentp != "AmazingERC20") {
            if (!values.tokenSupply) {
                errors.tokenSupply = 'Token Supply Required';
            } else if (isNaN(parseInt(values.tokenSupply))) {
                errors.tokenSupply = 'Token Supply should contain Numbers Only';
            } else if (parseInt(values.tokenSupply) <= 0) {
                errors.tokenSupply = 'Token Supply Should be more than 1';

            }
        }
        if ((tokentp == "SimpleERC20" || tokentp == "StandardERC20" || tokentp == "BurnableERC20" || tokentp == "HelloERC20") && !values.address) {
            errors.address = 'Minter Address Required';
        } else {
            if (("address" in errors)) {
                delete errors.address;
            }
        }

        return errors;
    }
    useEffect(async () => {

        varifydata();
    }, [formError]);
    const varifydata = () => {

        tokenDetails.validForm = Object.keys(formError).length == 0 ? true : false;

        if (Object.keys(formError).length == 0 && submitted) {
            getTokenDetails(tokenDetails);

        }
    }
    const formik = useFormik({
        initialValues: {
            tokenName: '',
            tokenSymbol: '',
            initialSupply: '1000',
            tokenDecimal: '18',
            tokenSupply: '1000'
        },
        onSubmit: values => {
            toast.success(JSON.stringify(values));
        }
    });
    formik.initialValues
    return (
        <div className="w-50 md:w-full mt-5 bg-white rounded-lg border border-gray-200 shadow-md p-2 sm:p-4 lg:p-6 dark:bg-gray-800 dark:border-gray-700">
            <form onSubmit={formik.handleSubmit}>
                <h5 className="text-center text-xl font-medium text-gray-900 dark:text-white">Token Details</h5>

                <br />
                <div>
                    <label for="tokenName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                        Token Name<span className="text-red-600">*</span></label>
                    <input
                        type="text"
                        name="tokenName"
                        id="tokenName"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        placeholder="Token Name"
                        onChange={(e) => {
                            onInputChange(e, "tokenName")
                        }}
                        required
                    />
                    <p className='my-1 clear-both text-xs text-gray-400'>Choose a name for your token.</p>
                    {submitted && formError.tokenName && (
                        <div className="block mb-2 text-sm font-medium text-red-900 dark:text-red-300">{formError.tokenName}</div>
                    )}
                </div>
                <div>
                    <label for="tokenSymbol" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                        Token Symbol<span className="text-red-600">*</span></label>
                    <input
                        type="text"
                        name="tokenSymbol"
                        id="tokenSymbol"
                        placeholder="Token Symbol"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        onChange={(e) => {
                            onInputChange(e, "tokenSymbol")
                        }}
                        required
                    />
                    <p className='my-1 clear-both text-xs text-gray-400'>Choose a symbol for your token (usually 3-5 chars).</p>
                    {submitted && formError.tokenSymbol && (
                        <div className="block mb-2 text-sm font-medium text-red-900 dark:text-red-300">{formError.tokenSymbol}</div>
                    )}
                </div>
                <div>
                    <label for="initialSupply" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                        Initial Supply<span className="text-red-600">*</span></label>
                    <input
                        type="text"
                        name="initialSupply"
                        id="initialSupply"
                        defaultValue="1000"
                        placeholder="Initial Supply"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        onChange={(e) => {
                            onInputChange(e, "initialSupply")
                        }}
                        disabled={isDisabledinitSupp}
                        required
                    />
                    <p className='my-1 clear-both text-xs text-gray-400'>Insert the decimal precision of your token. If you don't know what to insert, use 18.</p>
                    {submitted && formError.initialSupply && (
                        <div className="block mb-2 text-sm font-medium text-red-900 dark:text-red-300">{formError.initialSupply}</div>
                    )}
                </div>
                <div className='mb-1'>
                    <label for="tokenDecimals" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Token Decimals</label>
                    <Select
                        defaultValue={tokenDecimal}
                        options={tokenDecimalItem}
                        onChange={(value) => {
                            onInputChange(value, "tokenDecimal")
                        }}
                        classNamePrefix='supply-type'
                        className='text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'
                        components={{
                            IndicatorSeparator: () => null
                        }}
                        isDisabled={isDisabledTokenDeci}
                        inputProps={{ autoComplete: 'off', autoCorrect: 'off', spellCheck: 'off', Searchable: 'on' }}
                    />
                </div>
                {(tokentp != "UnlimitedERC20" && tokentp != "AmazingERC20") && <div>
                    <label for="tokenSupply" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Token Supply<span className="text-red-600">*</span></label>
                    <input
                        type="text"
                        name="tokenSupply"
                        id="tokenSupply"
                        defaultValue="1000"
                        placeholder="Token Supply"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        onChange={(e) => {
                            onInputChange(e, "tokenSupply")
                        }}
                        disabled={isDisabled}
                        required
                    />
                    <p className='my-1 clear-both text-xs text-gray-400'>Insert the maximum number of tokens available.</p>
                    {submitted && formError.tokenSupply && (
                        <div className="block mb-2 text-sm font-medium text-red-900 dark:text-red-300">{formError.tokenSupply}</div>
                    )}
                </div>}
                {displayAddress &&
                    <div>
                        <label for="address" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                            Minter address<span className="text-red-600">*</span></label>
                        <input
                            type="text"
                            name="address"
                            id="address"
                            defaultValue=""
                            placeholder="Minter address"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                            onChange={(e) => {
                                onInputChange(e, "address")
                            }}

                            required
                        />
                        <p className='my-1 clear-both text-xs text-gray-400'>Insert Minter Address.</p>
                        {submitted && formError.address && (
                            <div className="block mb-2 text-sm font-medium text-red-900 dark:text-red-300">{formError.address}</div>
                        )}
                    </div>
                }
            </form>

        </div>


    )
}