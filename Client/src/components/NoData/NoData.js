import React from 'react';
import images from '../../assets/icons';

export default function NoData() {
    return (
        <div className='bg-white flex flex-col justify-center items-center mt-5 p-4 rounded'>
            <img className='rounded' src={images.noDataFound} alt='No Data Found' />
            <p className='text-base font-medium mb-6'>No Data Found!!</p>
        </div>
    )
}