import React from 'react';
import Header from '../Shared/Header';
import Sidemenu from '../Shared/Sidemenu';

const Home = ({ children }) => {
    return (
        <div className="grid grid-cols-9 h-screen">
            <div className="col-span-2">
                <Sidemenu />
            </div>
            <div className='col-span-7 bg-blue-50'>
                <div className='bg-white p-6'>
                    <Header />
                </div>
                <div className='border bg-gray-500' />
                <div className='bg-blue-50 p-8'>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Home;