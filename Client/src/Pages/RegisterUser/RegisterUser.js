import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import Select from 'react-select'
import "./RegisterUser.scss";
import {
    USER_BASE_URL,
    globalService,
    CREATE_USER_URL,
    COUNTRY_LIST_URL
} from "../../helpers";


export default function registerUser() {
    const navigate = useNavigate();
    const state = {
        firstName: "",
        lastName: "",
        email_id: "",
        password: "",
        confirmPwd: ""
    };
    
    const [formValues, setFormValue] = useState(state)
    const [submitted, setSubmitValue] = useState(false);
    const [formError, setFormError] = useState({});
    const [country, setCountry] = useState([]);
    const [countryList, setCountryList] = useState([])


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValue({ ...formValues, [name]: value });
    }

    const handleSubmit = async (e) => {
        setSubmitValue(true);
        e.preventDefault();
        setFormError(validate(formValues));


    }

    const validate = (values) => {
        const error = {};
        let eamil_regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
        let pwd_regex = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8}');
        if (values.email_id == "") {
            error.email_id = "User Name Required!"
        } else if (!eamil_regex.test(values.email_id)) {
            error.email_id = "Required Valid Username!"
        }
        if (values.password == "") {
            error.password = "Password Required!"
        } else if (!pwd_regex.test(values.password)) {
            error.password = "Password should conatain minimum 8 character with at least a symbol, upper and lower case letters and a number"
        }
        if (values.confirmPwd == "") {
            error.confirmPwd = "Confirm Password Required!"
        } else if (values.confirmPwd != values.password) {
            error.confirmPwd = "Password and Confirm Password Should Be Same!"
        }
        if (values.firstName == "") {
            error.firstName = "First Name Required!"
        } if (values.lastName == "") {
            error.lastName = "Last Name Required!"
        }
        return error;
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
    }, [])
    useEffect(async () => {
       
        if (Object.keys(formError).length == 0 && submitted) {
            formValues.country = country.value;
            formValues.userName = formValues.email_id;

            var config = {
                method: "POST",
                url: `${USER_BASE_URL}/${CREATE_USER_URL}`,
                data: formValues,
            };
           

            try {
                const resp = await globalService(config);
               
                if (resp.length > 0) {
                    toast.success(resp);
                    navigate("/")
                }


            } catch (err) {
                console.log(err);
            }

        }

    }, [formError]);

    return (
        <>
            <div className="w-full my-6 max-w-sm bg-white rounded-lg border border-gray-200 shadow-md sm:p-6 lg:p-8 dark:bg-gray-800 dark:border-gray-700 mx-auto">
                <h2 className="intro-x font-bold text-2xl xl:text-3xl text-center xl:text-left">  Create Account</h2>
                <form name="form" onSubmit={handleSubmit}>
                    <div className="intro-x mt-8">
                        <h6>First Name <span className='text-red-600'>*</span></h6>
                        <input
                            type="text"
                            className={`block w-full intro-x login__input form-control py-3 px-4 border-gray-300 block ${submitted && formError.firstName != '' ? "input-error" : ""
                                }`}
                            placeholder="First Name"
                            name="firstName"
                            value={formValues.firstName}
                            onChange={handleChange}

                        />
                        {submitted && formError.firstName && (
                            <div className="block mb-2 text-sm font-medium text-red-600 dark:text-red-300">{formError.firstName}</div>
                        )}
                    </div>
                    <div className="intro-x mt-8">
                        <h6>Last Name <span className='text-red-600'>*</span></h6>
                        <input
                            type="text"
                            className={`block w-full intro-x login__input form-control py-3 px-4 border-gray-300 block ${submitted && formError.lastName != '' ? "input-error" : ""
                                }`}
                            placeholder="Last Name"
                            name="lastName"
                            value={formValues.lastName}
                            onChange={handleChange}

                        />
                        {submitted && formError.lastName && (
                            <div className="block mb-2 text-sm font-medium text-red-600 dark:text-red-300">{formError.lastName}</div>
                        )}
                    </div>

                    <div className="intro-x mt-8">
                        <h6>Email Id <span className='text-red-600'>*</span></h6>
                        <input
                            type="text"
                            className={`block w-full intro-x login__input form-control py-3 px-4 border-gray-300 block ${submitted && formError.email_id != '' ? "" : "border-red-300"
                                }`}
                            placeholder="Email Id"
                            name="email_id"
                            value={formValues.email_id}
                            onChange={handleChange}

                        />
                        {submitted && formError.email_id && (
                            <div className="block mb-2 text-sm font-medium text-red-600 dark:text-red-300">{formError.email_id}</div>
                        )}
                    </div>

                    <div className="intro-x mt-8">
                        <h6>Password <span className='text-red-600'>*</span></h6>
                        <input
                            type="password"
                            className={`block w-full intro-x login__input form-control py-3 px-4 border-gray-300 block mt-4 ${submitted && formError.password != '' ? "input-error" : ""
                                }`}
                            placeholder="Password"
                            name="password"
                            value={formValues.password}
                            onChange={handleChange}

                        />
                        {submitted && formError.password && (
                            <div className="block mb-2 text-sm font-medium text-red-600 dark:text-red-300">{formError.password}</div>
                        )}
                    </div>
                    <div className="intro-x mt-8">
                        <h6>Confirm Password<span className='text-red-600'>*</span></h6>
                        <input
                            type="password"
                            className={`block w-full intro-x login__input form-control py-3 px-4 border-gray-300 block mt-4 ${submitted && formError.confirmPwd != '' ? "input-error" : ""
                                }`}
                            placeholder="Confirm Password"
                            name="confirmPwd"
                            value={formValues.confirmPwd}
                            onChange={handleChange}

                        />
                        {submitted && formError.confirmPwd && (
                            <div className="block mb-2 text-sm font-medium text-red-600 dark:text-red-300">{formError.confirmPwd}</div>
                        )}
                    </div>

                    <div className="intro-x mt-8">

                        <h6>Country <span className='text-red-600'>*</span></h6>
                        <Select
                            defaultValue={countryList[1]}
                            value={country}
                            options={countryList}
                            onChange={(value) => setCountry(value)}
                            classNamePrefix='supply-type'
                            className='text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'
                            components={{
                                IndicatorSeparator: () => null
                            }}
                            inputProps={{ autoComplete: 'off', autoCorrect: 'off', spellCheck: 'off', Searchable: 'on' }}
                        />
                    </div>

                    <div className="intro-x mt-5 xl:mt-8 text-center xl:text-left">
                        <button type='submit' className="w-full bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded mt-9">
                            Sign Up
                        </button>

                    </div>
                </form>
            </div>
        </>
    )
}



