import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from "react-router-dom";
import "./Dashboard.scss";
import ChangeNetwork from "../../components/ChangeNetwork";


import {
  USER_BASE_URL,
  globalService,
  USER_LOGIN_URL,
} from "../../helpers";
import { CreateTokenIcon, DashboardImage } from '../../assets/SvgComponent';

export default function Dashboard() {
  const location = useLocation();
  const { pathname } = location;
  const splitLocation = pathname.split("/");
  let userdtl = JSON.parse(sessionStorage.getItem("user"));



  return (
    <>
      <p className='text-2xl font-medium'>At Poly Automator we believe in the tokenization of everything.</p>
      <p className='text-lg font-light my-4'>Bonds, stocks, fiat currencies, platform specific currencies, art, valuables, usage rights, certificates and many other assets are already being tokenized today.</p>
      <div className='bg-white p-8 rounded grid grid-cols-5 mt-6'>

        <div className='col-span-5 md:col-span-2 xl:col-span-3'>
          <p className='text-base font-light mb-3'>Token Tool by Poly Automator lets you create tokens on  Polygon Smart Chain in a simple and fast way without having to code your own smart contracts.</p>

          <p className='text-base font-medium mb-6'>To get started, click on Connect Wallet and select your preferred web3 wallet and the blockchain of your choice.</p>

          <p className='text-base font-light mb-3'>With Token Tool we make tokenization accessible via a convenient web3 token generator app. You can:</p>

          <div className='flex flex-row items-center mb-3'>
            <div className='w-6'>
              <CreateTokenIcon />
            </div>
            <p className='text-base font-light pl-2'>Create ERC20 tokens or their equivalent (ARC20, MRC20 and BEP20)</p>
          </div>

          <div className='flex flex-row items-center mb-3'>
            <div className='w-6'>
              <CreateTokenIcon />
            </div>
            <p className='text-base font-light pl-2'>Distribute tokens to many recipients</p>
          </div>

          <div className='flex flex-row items-center mb-3'>
            <div className='w-6'>
              <CreateTokenIcon />
            </div>
            <p className='text-base font-light pl-2'>Mint NFTs</p>
          </div>

          <div className='flex flex-row items-center mb-3'>
            <div className='w-6'>
              <CreateTokenIcon />
            </div>
            <p className='text-base font-light pl-2'>Create token sales</p>
          </div>

          <div className='flex flex-row items-center mb-3'>
            <div className='w-6'>
              <CreateTokenIcon />
            </div>
            <p className='text-base font-light pl-2'>Manage tokens and mint more, burn</p>
          </div>
        </div>

        <div className='invisible md:visible md:col-span-3 xl:col-span-2'>
          <DashboardImage />
        </div>

      </div>
      <ChangeNetwork></ChangeNetwork>
    </>
  )
}



