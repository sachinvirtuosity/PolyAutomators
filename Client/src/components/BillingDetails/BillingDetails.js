import { useFormikContext, Formik, Form, Field, useFormik, ErrorMessage } from 'formik'
import React, { useContext, useState, useEffect } from 'react';
import Loader from 'react-loading';
import Select from 'react-select'
import {
    USER_BASE_URL,
    globalService,
    COUNTRY_LIST_URL
} from "../../helpers";

var billingDtl = {
    walletAddress: '',
    legalName: '',
    emailid: '',
    billingAddress: '',
    zipCode: '',
    city: '',
    state: '',
    country: '',
    taxId: '',
    taxRegNumber: ''
};
export default function BillingDetails(tokendtl) {
    const { setFieldValue } = useFormikContext();
    const [isloading, setLoading] = useState(false);
    const [formError, setFormError] = useState({});
    const [submitted, setSubmitValue] = useState(false);
    const [country, setCountry] = useState([]);
    const [countryList, setCountryList] = useState([]);
    const [isDisabledBtn, setisDisabledBtn] = useState(true)
    const user = JSON.parse(sessionStorage.getItem("user"));
    billingDtl.walletAddress = user.isMetamask ? user.username : '';
    const formik = useFormik({
        initialValues: {
            walletAddress: user.isMetamask ? user.username : '',
            legalName: '',
            emailid: '',
            billingAddress: '',
            zipCode: '',
            city: '',
            state: '',
            country: '',
            taxId: '',
            taxRegNumber: ''
        }
    });

    formik.initialValues

    const validate = (value) => {
        let email_regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
        let zip_regex = new RegExp('[0-9]{5}(?:-[0-9]{4})?$');
        let contractAddress_regex = new RegExp('0x[a-fA-F0-9]{40}$');
        let errors = {};
        if (!value.walletAddress) {
            errors.walletAddress = "Wallet Address Required."
        } else if (!contractAddress_regex.test(value.walletAddress)) {
            errors.walletAddress = " Required Valid Wallet Address."
        }
        if (!value.legalName) {
            errors.legalName = "Creator or Business Legal Name Required."
        }
        if (!value.emailid) {
            errors.emailid = "Email ID Required."
        } else if (!email_regex.test(value.emailid)) {
            errors.emailid = "Required Valid EmailId";
        }
        if (!value.billingAddress) {
            errors.billingAddress = "Billing Address Required."
        }
        if (!value.zipCode) {
            errors.zipCode = "Zip/Postal Code Required."
        } else if (!zip_regex.test(value.zipCode)) {
            errors.zipCode = "Required Valid Zip/Postal Code";
        }
        if (!value.city) {
            errors.city = "City Name Required."
        }
        if (!value.state) {
            errors.state = "State Name Required."
        }
        if (!value.country) {
            errors.country = "Country Name Required."
        }
        if (!value.taxId) {
            errors.taxId = "Tax ID Code Required."
        }
        if (!value.taxRegNumber) {
            errors.taxRegNumber = "VAT or Tax Registration Number Required."
        }


        return errors;
    }

    useEffect(async () => {
        var config = {
            method: "GET",
            url: `${USER_BASE_URL}/${COUNTRY_LIST_URL}`,

        };
        try {
            const resp = await globalService(config);

            setCountryList(resp.map(key => ({

                label: key.countryName,
                value: key._id
            })));
            setCountry(countryList[0]);
        } catch (e) {
           
        }
    }, []);

    const onInputChange = async (e, key) => {


        if (key == "country") {
            setCountry(e);
            billingDtl[key] = e.value;
            billingDtl["countryName"] = e.label;
        } else {
            const { value } = e.currentTarget;
            setFieldValue(key, value);

            billingDtl[key] = value;
        }
        setSubmitValue(true);
        setFormError(validate(billingDtl));
    }

    useEffect(async () => {
        billingDtl.validBillingDtls = Object.keys(formError).length == 0 ? true : false;
        if (Object.keys(formError).length == 0 && submitted) {
            setisDisabledBtn(false)
            tokendtl.setTokenDetails["billingDetails"] = billingDtl;
        }
    }, [formError]);

    const handleSubmit = (e) => {
        setLoading(true);
        e.preventDefault();
        if (Object.keys(formError).length == 0 && submitted) {

            tokendtl.setbillingDtl(!tokendtl.billingDtl);
          
        }
        setLoading(false);
    }

    return (
        <form className="w-full flex flex-col md:flex-row">

            <div className="w-full md:w-1/2 mt-5 mr-3 bg-white rounded-lg border border-gray-200 shadow-md p-2 sm:p-4 lg:p-6 dark:bg-gray-800 dark:border-gray-700 ">
                <div className='mb-2'>
                    <label for="walletAddress" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                        Creator Wallet Address<span className="text-red-600">*</span></label>
                    <input
                        type="text"
                        name="walletAddress"
                        id="walletAddress"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        placeholder="Creator Wallet Address"
                        defaultValue={user.isMetamask ? user.username : ''}
                        onChange={(e) => {
                            onInputChange(e, "walletAddress")
                        }}
                        required
                    />
                    {submitted && formError.walletAddress && (
                        <div className="block mb-2 text-sm font-medium text-red-900 dark:text-red-300">{formError.walletAddress}</div>
                    )}
                </div>

                <div className='mb-2'>
                    <label for="emailid" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"> Email Id</label>
                    <input
                        type="text"
                        name="emailid"
                        id="emailid"
                        placeholder="Email Id"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        onChange={(e) => {
                            onInputChange(e, "emailid")
                        }}
                        required
                    />

                    {submitted && formError.emailid && (
                        <div className="block mb-2 text-sm font-medium text-red-900 dark:text-red-300">{formError.emailid}</div>
                    )}
                </div>


                <div className='mb-2'>
                    <label for="billingAddress" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                        Billing Address<span className="text-red-600">*</span></label>
                    <textarea
                        name="billingAddress"
                        id="billingAddress"
                        placeholder="Billing Address"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        onChange={(e) => {
                            onInputChange(e, "billingAddress")
                        }}
                        required
                    />
                    {submitted && formError.billingAddress && (
                        <div className="block mb-2 text-sm font-medium text-red-900 dark:text-red-300">{formError.billingAddress}</div>
                    )}

                </div>

                <div className='mb-2'>
                    <label for="state" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"> State</label>
                    <input
                        type="text"
                        name="state"
                        id="state"
                        placeholder="State"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        onChange={(e) => {
                            onInputChange(e, "state")
                        }}
                        required
                    />

                    {submitted && formError.state && (
                        <div className="block mb-2 text-sm font-medium text-red-900 dark:text-red-300">{formError.state}</div>
                    )}
                </div>

                <div className='mb-2'>
                    <label for="taxId" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"> Tax ID Code</label>
                    <input
                        type="text"
                        name="taxId"
                        id="taxId"
                        placeholder="Tax ID Code"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        onChange={(e) => {
                            onInputChange(e, "taxId")
                        }}
                        required
                    />

                    {submitted && formError.taxId && (
                        <div className="block mb-2 text-sm font-medium text-red-900 dark:text-red-300">{formError.taxId}</div>
                    )}
                </div>
            </div>

            <div className="w-full md:w-1/2 mt-5 bg-white rounded-lg border border-gray-200 shadow-md p-2 sm:p-4 lg:p-6 dark:bg-gray-800 dark:border-gray-700">

                <div className='mb-2'>
                    <label for="legalName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                        Creator or Business Legal Name<span className="text-red-600">*</span></label>
                    <input
                        type="text"
                        name="legalName"
                        id="legalName"
                        placeholder="Creator or Business Legal Name"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        onChange={(e) => {
                            onInputChange(e, "legalName")
                        }}
                        required
                    />

                    {submitted && formError.legalName && (
                        <div className="block mb-2 text-sm font-medium text-red-900 dark:text-red-300">{formError.legalName}</div>
                    )}
                </div>
                <div className='mb-2'>
                    <label for="zipCode" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Zip/Postal Code</label>
                    <input
                        type="text"
                        name="zipCode"
                        id="zipCode"
                        placeholder="Zip/Postal Code"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        onChange={(e) => {
                            onInputChange(e, "zipCode")
                        }}
                        required
                    />

                    {submitted && formError.zipCode && (
                        <div className="block mb-2 text-sm font-medium text-red-900 dark:text-red-300">{formError.zipCode}</div>
                    )}
                </div>



                <div className='mb-2'>

                    <label for="country" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                        Country/Region<span className="text-red-600">*</span></label>
                    <Select
                        defaultValue={countryList[1]}
                        value={country}
                        options={countryList}
                        onChange={(value) => onInputChange(value, "country")}
                        classNamePrefix='supply-type'
                        className='text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'
                        components={{
                            IndicatorSeparator: () => null
                        }}
                        inputProps={{ autoComplete: 'off', autoCorrect: 'off', spellCheck: 'off', Searchable: 'on' }}
                    />
                    {submitted && formError.country && (
                        <div className="block mb-2 text-sm font-medium text-red-900 dark:text-red-300">{formError.country}</div>
                    )}
                </div>

                <div className='mb-2'>
                    <label for="city" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"> City</label>
                    <input
                        type="text"
                        name="city"
                        id="city"
                        placeholder="City"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        onChange={(e) => {
                            onInputChange(e, "city")
                        }}
                        required
                    />

                    {submitted && formError.city && (
                        <div className="block mb-2 text-sm font-medium text-red-900 dark:text-red-300">{formError.city}</div>
                    )}
                </div>

                <div className='mb-2'>
                    <label for="taxRegNumber" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"> VAT or Tax Registration Number</label>
                    <input
                        type="text"
                        name="taxRegNumber"
                        id="taxRegNumber"
                        placeholder="VAT or Tax Registration Number"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        onChange={(e) => {
                            onInputChange(e, "taxRegNumber")
                        }}
                        required
                    />

                    {submitted && formError.taxRegNumber && (
                        <div className="block mb-2 text-sm font-medium text-red-900 dark:text-red-300">{formError.taxRegNumber}</div>
                    )}
                </div>
                {isloading ? <div className="cover-spin flex justify-center items-center">

                    <Loader type={'spinningBubbles'} color="#ed8936">

                    </Loader>

                </div> :
                    <button disabled={isDisabledBtn} className={`w-full  rounded text-white mt-2 h-10 ${isDisabledBtn ? "bg-gray-300 cursor-not-allowed" : "bg-orange-500 "}`} onClick={(e) => handleSubmit(e)}>Next</button>
                }
            </div>

        </form>
    )
}