import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';

const Product = () => {
  const {productId} = useParams();
  const { products, currency , addToCart } = useContext(ShopContext);
  const [productData,setProductData] = useState(false);
  const [image,setImage] = useState('');
  const [size,setSize] = useState('');
  


  const fetchProductData = () => {
    const item = products.find((productItem) => productItem._id === productId);
    if (item) {
      setProductData(item);
      setImage(item.image[0]);
    }
  }
  useEffect(()=>{
    fetchProductData();


  },[productId, products])
  
  return productData?(
    <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100 '>
      {/* Product Data */}
      <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>
        
        {/* Product Images */}
        <div className='flex-1 flex flex-col-reverse gap-4 sm:flex-row'>
          <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-auto justify-start sm:justify-start sm:w-[18%] w-full gap-3'>
            {
              productData.image.map((item,index)=>(
                <img 
                  src={item} 
                  key={index} 
                  onClick={()=>setImage(item)}
                  className={`w-20 h-20 sm:w-full sm:aspect-square shrink-0 cursor-pointer object-cover rounded-md border-2 ${image===item ? 'border-black' : 'border-transparent'}`} 
                  alt="" 
                />


              ))
            }
          </div>

          <div className='w-full sm:w-[80%]'>
            <div className='w-full aspect-square rounded-lg bg-gray-50 overflow-hidden flex items-center justify-center'>
              <img 
                src={image || productData.image[0]} 
                alt={productData.name} 
                className='w-full h-full object-contain'
              />
            </div>
          </div>
        </div>
        {/* -----Product INfo-----  */}
        <div className='flex-1'>
          <h1 className='font-medium text-2xl mt-2'>{productData.name}</h1>
          <div className='flex items-center gap-1 mt-2'>
            <img src={assets.star_icon} alt="" className='w-3.5' />
            <img src={assets.star_icon} alt="" className='w-3.5' />
            <img src={assets.star_icon} alt="" className='w-3.5' />
            <img src={assets.star_icon} alt="" className='w-3.5' />
            <img src={assets.star_dull_icon} alt="" className='w-3.5' />
            <p className='pl-2'>(122)</p>

          </div>
          <p className='mt-5 text-3xl font-medium'>{currency}{productData.price}</p>
          <p className='mt-5 text-gray-500 md:s-4/5'>{productData.description}</p>
          <div className='flex flex-col gap-4 my-8'>
            <p>Select Size</p>
            <div className='flex gap-2'>
              {productData.sizes?.map((item, index) => (
                <button onClick={() => setSize(item)} key={index} className={`border py-2 px-4 bg-gray-100 ${item === size ? 'border-orange-500' : ''}`}>{item}</button>
              ))}
            </div>
          </div>

          <button className='bg-black text-white px-8 py-3 text-sm active:bg-gray-700' onClick={()=>addToCart(productData._id,size)}>ADD TO CART</button>
          <hr className='mt-8 sm:w-4/5'/>
          <div className='text-sm text-gray-500 mt-5 flex flex-col gap-1'>
            <p>100% Original Product</p>
            <p>Cash on delivery is available on this product</p>
            <p>Easy return and exhange within 7 days.</p>

          </div>

        </div>
      </div>
      {/* ----------- Description and Review Section---------------- */}
      <div className='mt-20'>
        <div className='flex'>
          <b className='border px-5 py-3 text-sm'>Description</b>
          <p className='border px-5 py-3 text-sm'>Reviews (122)</p>
        </div>
        <div className='flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500'>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate eaque temporibus excepturi earum provident ullam odit, a vero nesciunt dolor quod culpa quos tenetur maiores corporis, obcaecati deleniti, asperiores necessitatibus?</p>
          <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ut, doloremque ex fugit aut error maxime laborum quam. Magnam eaque, odio libero exercitationem doloribus officia atque saepe blanditiis vel, veniam debitis?</p>
        </div>
      </div>

      {/* ---------display related products------------- */}
       <RelatedProducts category={productData.category} subCategory={productData.subCategory}/>

      
    </div>
  ): <div className='opacity-0'></div>
}

export default Product
