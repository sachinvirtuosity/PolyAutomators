import React from 'react';
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import "./Sidemenu.scss";
import FeatherIcon from "feather-icons-react";

export default function Sidemenu() {
  const location = useLocation();
  const navigate = useNavigate();
  const { pathname } = location;
  const splitLocation = pathname.split("/");
  //const isDisplay = sessionStorage.getItem("user") == null ? false : true;

  return (
    <>
      
        <div className='side-menu h-full'>
          <nav className='flex flex-col items-center justify-center'>

            <div className='flex items-center px-2 md:px-4 pt-4 pb-3 cursor-pointer'
              onClick={() => { navigate('/dashboard') }}>
              <img src="./../../assets/icons/logo1.png"></img>
              <div className='flex flex-col'>
                <span className='px-1 md:px-3 font-semibold text-2xl text-orange tracking-tight py-0'>
                  Poly
                </span>
                <span className='px-1 md:px-3 font-semibold text-2xl text-orange tracking-tight py-0'>
                  Automator
                </span>

              </div>
            </div>
            <div className='w-full border border-white-500' />
            <ul className='pt-4'>
              <li>
                <NavLink
                  to="/dashboard"
                  className={
                    splitLocation[1] === "dashboard"
                      ? "fas side-menu-active"
                      : "fas"
                  }
                >
                  <div className='flex flex-row'>
                    <FeatherIcon icon="grid" size="20px"></FeatherIcon>
                    <p className='px-2'>
                      Dashboard
                    </p>
                  </div>
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/create"
                  className={
                    splitLocation[1] === "create"
                      ? "fas side-menu-active"
                      : "fas"
                  }
                >
                  <div className='flex flex-row'>
                    <FeatherIcon icon="disc" size="20px"></FeatherIcon>
                    <p className=' px-2'>
                      Create Token
                    </p>
                  </div>
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/tokenList"
                  className={
                    splitLocation[1] === "tokenList"
                      ? "fas side-menu-active"
                      : "fas"
                  }
                >
                  <div className='flex flex-row'>
                    <FeatherIcon icon="list" size="20px"></FeatherIcon>
                    <p className=' px-2'>
                      Tokens
                    </p>
                  </div>
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/manageToken"
                  className={
                    splitLocation[1] === "manageToken"
                      ? "fas side-menu-active"
                      : "fas"
                  }
                >
                  <div className='flex flex-row'>
                    <FeatherIcon icon="settings" size="20px"></FeatherIcon>
                    <p className=' px-2'>
                      Manage Token
                    </p>
                  </div>
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/distributeToken"
                  className={
                    splitLocation[1] === "distributeToken"
                      ? "fas side-menu-active"
                      : "fas"
                  }
                >
                  <div className='flex flex-row'>
                    <FeatherIcon icon="slack" size="20px"></FeatherIcon>
                    <p className='px-2'>
                      Distribute Token
                    </p>
                  </div>
                </NavLink>
              </li>

            </ul>
          </nav>

        </div>
      
    </>
  )
}



