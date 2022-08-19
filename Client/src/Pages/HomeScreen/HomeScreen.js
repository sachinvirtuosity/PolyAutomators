import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import images from '../../assets/icons';
import { CreateTokenIcon, DashboardImage } from '../../assets/SvgComponent';
import { useMetaMask } from "metamask-react";
import Loader from 'react-loading';
import MetaMaskOnboarding from '@metamask/onboarding';
import {
    metaMaskLogin
} from "../../helpers";

const data = [
    {
        label: 'Standard',
        value: 'Your Token will be fully compliant with the ERC20 definition and compatible with any ERC20 wallet all around the world. It will have name, symbol & decimals amount.'
    },
    {
        label: 'Detailed',
        value: 'You can use your Token in Exchanges, DEX, Uniswap, any ERC20 compatible wallet.You can add logo to your ERC20 Token'
    },
    {
        label: 'Burnable',
        value: 'Your Token can be burnt. It means that you can choose to reduce the circulating supply by destroying some of your token’s amount.'
    },
    {
        label: 'Mintable',
        value: 'You will be able to generate tokens by minting them. Only token owner will be able to mint. You can also disable minting.'
    },
    {
        label: 'Pausable',
        value: 'Your Token transfer can be paused. Useful to prevent trades until a period or freezing all token transfers.'
    },
    {
        label: 'Ownable Access',
        value: 'Your Token will have an Owner. Token owner will be able to mint new tokens or to call the finish minting function.'
    },
    {
        label: 'Role Based Access',
        value: 'Your Token will have Roles. You can add or remove ADMIN or MINTER role to addresses. Your token will be Ownable too.'
    },
    {
        label: 'Capped',
        value: 'You wont be able to generate more tokens than the defined token cap. This ensures that you will not generate more tokens than declared.'
    },
    {
        label: 'ERC1363 Payable Token',
        value: 'The ERC1363 is an ERC20 compatible Token that can make a call back on the receiver contract to notify token transfers or token approvals.'
    },
    {
        label: 'Token Recover',
        value: 'Lots of tokens are lost forever into Smart Contracts. It allows the contract owner to recover any ERC20 token sent into the contract by error.'
    },

]
const HomeScreen = () => {
    const { status, account, ethereum } = useMetaMask();
    const [accountId, setAccountId] = useState('');
    const [isloading, setLoading] = useState(false);
    const navigate = useNavigate();
    const handleTokenTool = async() => {
        sessionStorage.clear();
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
        <div className='bg-blue-50'>
            <div className='bg-white p-4 flex flex-row justify-between items-center'>
                <div className='flex items-center px-2 md:px-4 pt-4 pb-3 cursor-pointer'>
                    <img src={images.logoImage}></img>
                    <div className='flex flex-col'>
                        <span className='px-1 md:px-3 font-semibold text-2xl text-orange tracking-tight py-0'>
                            Poly
                        </span>
                        <span className='px-1 md:px-3 font-semibold text-2xl text-orange tracking-tight py-0'>
                            Automator
                        </span>

                    </div>
                </div>
                <div className='flex flex-col sm:flex-row justify-center items-center'>
                    <div className='bg-blue-50 w-20 p-2 m-4 text-center rounded'>
                        <button onClick={() => { navigate('/login') }}>Login</button>
                    </div>
                    {isloading ? <div className="cover-spin flex justify-center items-center">

                        <Loader type={'spinningBubbles'} color="#ed8936">

                        </Loader>

                    </div> :
                        <div className='bg-blue-50 w-40 p-2 m-4 text-center rounded'>
                            <button onClick={(e) => { handleTokenTool() }}>Token Tool</button>
                        </div>
                    }
                </div>
            </div>
            <hr />
            <div className='bg-white p-4 grid grid-row md:grid-cols-2'>
                <div className='md:col-span-1 flex justify-center p-16'>
                    <p className='text-lg font-medium'>
                        Create your tokens in a minute with our Smart Contract Generator tool.
                        Deploy it on your preferred EVM compatible blockchain such as Ethereum, Polygon, Avalanche and Binance Smart Chain. Sign up or Login with MetaMask.
                        No setup required. No coding required.Get 100% ownership of generated tokens.
                    </p>
                </div>
                <div className='md:col-span-1 flex justify-center rounded'>
                    <img src={images.homeScreen} alt='' className='rounded' />
                </div>
            </div>

            <div className='my-4 p-4'>
                <p className='text-center text-4xl font-medium'>How it works</p>
                <div className='grid grid-cols-2'>
                    <div className='col-span-1 flex justify-center'>
                        <DashboardImage />
                    </div>
                    <div className='col-span-1 flex flex-col justify-center items-start'>
                        <div className='flex flex-row items-center mb-3'>
                            <div className='w-6'>
                                <CreateTokenIcon />
                            </div>
                            <p className='text-base font-light pl-2'>Install MetaMask with an amount of ETH to pay for contract deployment.</p>
                        </div>
                        <div className='flex flex-row items-center mb-3'>
                            <div className='w-6'>
                                <CreateTokenIcon />
                            </div>
                            <p className='text-base font-light pl-2'>Login as existing User or via MetaMask.</p>
                        </div>
                        <div className='flex flex-row items-center mb-3'>
                            <div className='w-6'>
                                <CreateTokenIcon />
                            </div>
                            <p className='text-base font-light pl-2'>Enter your preferred Token details, Choose your supply and Token type.</p>
                        </div>
                        <div className='flex flex-row items-center mb-3'>
                            <div className='w-6'>
                                <CreateTokenIcon />
                            </div>
                            <p className='text-base font-light pl-2'>Deploy Token, confirm your transaction using MetaMask.</p>
                        </div>
                        <div className='flex flex-row items-center mb-3'>
                            <div className='w-6'>
                                <CreateTokenIcon />
                            </div>
                            <p className='text-base font-light pl-2'>Once deployed your Token is ready to use.</p>
                        </div>
                        <div className='flex flex-row items-center mb-3'>
                            <div className='w-6'>
                                <CreateTokenIcon />
                            </div>
                            <p className='text-base font-light pl-2'>You can try on Test Network before to go live.</p>
                        </div>
                    </div>
                </div>

            </div>

            <div className='my-4 p-4'>
                <p className='text-center text-4xl font-medium'>Features</p>
                <div className='grid grid-cols-2 md:grid-cols-4'>
                    {data.map((obj, k) => (
                        <div key={k} className='shadow rounded-lg bg-white m-4 p-4 cursor-pointer hover:scale-105'>
                            <p className='text-xl font-medium my-2'>{obj.label}</p>
                            <p className='text-lg font-normal my-2'>{obj.value}</p>
                        </div>

                    ))}
                </div>
            </div>

        </div >
    )
}

export default HomeScreen;