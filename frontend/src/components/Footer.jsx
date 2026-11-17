import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
        <div>
          <img src={assets.logo} className='mb-5 w-32' alt="" />
          <p className='w-full md:w-2/3 text-gray-600 '>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam officia voluptates, ex quae error quibusdam. Mollitia id assumenda similique rem asperiores pariatur. Dignissimos beatae quas enim doloribus inventore repellat exercitationem.

          </p>

        </div>
        <div>
          <p className='text-xl font-medium mb-5'>COMPANY</p>
          <ul className='flex flex-col gap-1 text-gray-600'>
            <Link to='/'>Home</Link>
            <Link to='/about'>About us</Link>
            <Link>Delivery</Link>
            <Link>Privacy Policy</Link>
          </ul>
        </div>
        <div>
          <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
          <ul className='flex flex-col gap-1 text-gray-600'>
            <li>+91 876890493</li>
            <li>contact@fitra.com</li>
          </ul>
        </div>

      </div>
      <div>
        <hr />
        <p className='py-5 text-sm text-center'>Copyright 2024@ fitra.com - All Right Reserved.</p>
      </div>

      
    </div>
  )
}

export default Footer
