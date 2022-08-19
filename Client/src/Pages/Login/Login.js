import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate } from "react-router-dom";
import LoginViaEmail from "../../components/LoginViaEmail"
import { useMetaMask } from "metamask-react";
import Loader from 'react-loading';
import MetaMaskOnboarding from '@metamask/onboarding';
import "./Login.scss";
import {
    metaMaskLogin
} from "../../helpers";

export default function Login() {
    const { status, account, ethereum } = useMetaMask();
    const [showLogin, setShowLogin] = useState(false);
    const [accountId, setAccountId] = useState('');
    const [isloading, setLoading] = useState(false);
    const navigate = useNavigate();
    const onboarding = React.useRef();

    const handleSubmit = async (e) => {
        setLoading(true);
        if (status == "unavailable") {

            onboarding.current = new MetaMaskOnboarding();
            onboarding.current.startOnboarding();


        } else {
            if (status == "notConnected") {
                ethereum.request({
                    method: "eth_requestAccounts"

                }).then((res) => {
                    setAccountId(res[0])
                });


            } else {
                setAccountId(account)
            }


        }
    }

    useEffect(async () => {
        if (accountId != '') {
            const resp = await metaMaskLogin(accountId);
            if (resp == "success") {
                navigate("/dashboard");
                window.location.reload();
            } else {
                toast.error(resp.msg);
            }
            setLoading(false);
          
        }
    }, [accountId]);

    return (
        <>
            {!showLogin ?
                <div className="w-full my-6 max-w-sm bg-white rounded-lg border border-gray-200 shadow-md sm:p-6 lg:p-8 dark:bg-gray-800 dark:border-gray-700 mx-auto">
                    <h2 className="text-center  font-bold text-xl text-yellow-600">  Poly Automator</h2>

                    <div className="intro-x mt-5 xl:mt-4 text-center xl:text-left">
                        <button type='submit' onClick={() => setShowLogin(!showLogin)} className="w-full  bg-gray-500 hover:bg-gray-800 text-white  font-bold py-2 px-4 rounded mt-9">
                            Login Via Email Id
                        </button>
                        {isloading ? <div className="cover-spin flex justify-center items-center">

                            <Loader type={'spinningBubbles'} color="#ed8936">

                            </Loader>

                        </div> :
                            <button type='submit' onClick={handleSubmit} className="w-full  bg-orange-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded mt-2">
                                Login Via Metamask
                            </button>
                        }
                       

                    </div>
                    <div className="intro-x mt-2 text-center text-gray-500 hover:text-yellow-600 cursor-pointer"
                        onClick={() => { navigate('/register') }}>
                        <div className='mt-2'>
                            <p >Dont have account ? Sign Up here </p>
                        </div>

                        <Outlet />
                    </div>
                </div>
                :
                <div>
                    <div className="tab-pane fade show active" id="pills-homeJustify" role="tabpanel"
                        aria-labelledby="pills-home-tabJustify">
                        <LoginViaEmail />
                    </div>
                </div>
            }
        </>
    )
}



