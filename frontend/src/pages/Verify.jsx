import { useCallback, useContext, useEffect } from 'react'

import { ShopContext } from '../context/ShopContext'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'

const Verify = () => {
const {navigate , token, setCartItems, backendUrl} = useContext(ShopContext)
const [searchParams] = useSearchParams();

const sessionId = searchParams.get('session_id');
const cancelled = searchParams.get('cancelled');
const orderId = searchParams.get('orderId');

const verifyPayment = useCallback(async () => {

  try {
    if (!token) {
      return null;
      
    }

    const response = await axios.post(
      backendUrl+'/api/order/verifyStripe',
      { sessionId, cancelled, orderId },
      {headers:{token}}
    )
    console.log(response.data.success);
    
    if (response.data.success) {
      setCartItems({})
      navigate('/orders')
      
    }else{
      navigate('/cart')
    }
  } catch (error) {
    console.log(error);
    toast.error(error.message)
    
    
  }


}, [backendUrl, cancelled, navigate, orderId, sessionId, setCartItems, token])

useEffect(()=>{
  verifyPayment()

},[verifyPayment])
  return (
    <div>
       
      
    </div>
  )
}

export default Verify
