import React from 'react'

const DashCard = ({title,count}) => {

 

  return (
    
      <div className='text-center px-6 flex gap-2 md:gap-5 bg-white text-gray-600 hover:bg-green-600 hover:text-white shadow-xl rounded-xl justify-evenly items-center w-full  p-2 md:p-5 '>
        <div><img src='/images/logo.svg' className='w-8 h-12 md:w-16'></img></div>
        <div className='flex flex-col items-center flex-1'>
          <div className='text-md md:text-lg'>{title}</div>
          <div className='text-md md:text-lg my-2 text-center md:text-left'>{count}</div>
        </div>
      </div>
    
  )
}

export default DashCard;
