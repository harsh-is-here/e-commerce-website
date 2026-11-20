
import orderModel from "../models/orderModel.js";
import userModel from "../models/user_model.js";
import Stripe from 'stripe'
import razorpay from 'razorpay'
//global varibales

const currency = 'usd'
const deliveryCharges = 10


// GATEWAY INITALIZED
const razorpayInstance = new razorpay({
  key_id : process.env.RAZORPAY_KEY_ID,
  key_secret : process.env.RAZORPAY_KEY_SECRET
})
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)


// Placing orders using COD method

const placeOrder = async(req,res) =>{

  try {

    const {userId,items,amount,address} = req.body;
    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "COD",
      payment:false,
      date:Date.now()

    }

    const newOrder = new orderModel(orderData);
    await newOrder.save()

    await userModel.findByIdAndUpdate(userId,{cartData : {}})

    res.json({success:true,message:'Order Placed'})


    
  } catch (error) {

    console.log(error);
    res.json({success:false,message:error.message})
    
    
  }

}

// Placing orders using stripe method

const placeOrderStripe = async(req,res) =>{

  try {

    const {userId,items,amount,address} = req.body;
    const {origin} = req.headers;
    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "Stripe",
      payment:false,
      date:Date.now()

    }
    const newOrder = new orderModel(orderData);
    await newOrder.save()


    const line_items = items.map((item)=>({
      price_data:{
        currency:currency,
        product_data:{
          name:item.name

        },
        unit_amount: item.price*100
    
      },
      quantity: item.quantity


    }))

    line_items.push({
      price_data:{

        currency:currency,
        product_data:{
          name:'Delivery Charges'

        },
        unit_amount: deliveryCharges*100
    
      },
      quantity: 1

    })

    const frontendUrl = process.env.FRONTEND_URL || origin;

    const session = await stripe.checkout.sessions.create({
      success_url: `${frontendUrl}/verify?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url : `${frontendUrl}/verify?cancelled=true&orderId=${newOrder._id}`,
      line_items,
      mode: 'payment',
      metadata: {
        orderId: newOrder._id.toString(),
        userId
      }
    })

    await orderModel.findByIdAndUpdate(newOrder._id, {
      stripeSessionId: session.id
    })

    res.json({success:true,session_url:session.url})


    
  } catch (error) {
    console.log(error);
    res.json({success:false,message:error.message})

    
  }
  
}

//verify stripe
const verifyStripe = async (req,res) =>{
  const {sessionId, cancelled, orderId, userId} = req.body;

  try {
    if (cancelled === "true") {
      await orderModel.findOneAndDelete({_id: orderId, userId});
      return res.json({success:false, cancelled:true})
    }

    if (!sessionId) {
      return res.json({success:false, message:'Stripe session ID is required'})
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId)
    const sessionOrderId = session.metadata?.orderId
    const sessionUserId = session.metadata?.userId

    if (!sessionOrderId) {
      return res.json({success:false, message:'Invalid Stripe session'})
    }

    if (sessionUserId !== userId) {
      return res.json({success:false, message:'Stripe session does not belong to this user'})
    }

    const order = await orderModel.findOne({_id:sessionOrderId, userId})

    if (!order) {
      return res.json({success:false, message:'Order not found'})
    }

    if (order.stripeSessionId && order.stripeSessionId !== session.id) {
      return res.json({success:false, message:'Stripe session does not belong to this order'})
    }

    if (session.status !== 'complete' || session.payment_status !== 'paid') {
      return res.json({success:false, message:'Payment is not complete'})
    }

    if (session.currency !== currency || session.amount_total !== Math.round(order.amount * 100)) {
      return res.json({success:false, message:'Payment amount or currency mismatch'})
    }

    await orderModel.findByIdAndUpdate(sessionOrderId, {payment:true})
    await userModel.findByIdAndUpdate(userId,{cartData:{}})

    res.json({success:true})

  } catch (error) {
    console.log(error);
    res.json({success:false,message:error.message})
  }
}
 

// Placing orders using Razorpay method

const placeOrderRazorPay = async(req,res) =>{

  try {


    const {userId,items,amount,address} = req.body;
    
    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "Razorpay",
      payment:false,
      date:Date.now()

    }
    const newOrder = new orderModel(orderData);
    await newOrder.save()

    const options = {
      amount : amount * 100,
      currency : currency.toUpperCase(),
      receipt : newOrder._id.toString()

    }

    await razorpayInstance.orders.create(options,(error,orders)=>{

      if (error) {
        console.log(error);
        return res.json({success:false, message:error})
        
      }
      res.json({success:true,order})


    })
    
  } catch (error) {

    console.log(error);
    res.json({success:false, message:error.message})
    
    
  }
  
}

// All orders data for admin panel

const allOrders = async(req,res) =>{

  try {
    const orders = await orderModel.find({})
    res.json({success:true , orders})
    
  } catch (error) {
    console.log(error);
    res.json({success:false , message:error.message})
    
  }
  
}

// user orders data for frontend

const userOrders = async(req,res) =>{
  try {
    const {userId} = req.body

    const orders = await orderModel.find({userId})
    res.json({success:true , orders})
    
  } catch (error) {
    console.log(error);
    res.json({success:false , message:error.message})
    

    
  }
  
}

// update order status for admin pannel



const updateStatus = async(req,res) =>{
  try {

    const { orderId, status } = req.body
    await orderModel.findByIdAndUpdate(orderId , { status })
    
    res.json({success:true, message:'Status Updated'})
    
  } catch (error) {
    console.log(error);
    res.json({success:false , message:error.message})
    
    
  }
  
}

export {verifyStripe,placeOrder,placeOrderRazorPay,placeOrderStripe,allOrders,userOrders,updateStatus}