const express=require('express');
const auth=require('../authentication/auth');
const subsController=require('../controllers/subsController');

const subsRoute=express.Router();//subscriptionRoute

subsRoute.post('/orders',subsController.placeAnOrder)

subsRoute.post('/success',subsController.verifyPayment);

subsRoute.get('/allplans',auth.isLogin,subsController.getAllPlans);


module.exports=subsRoute;