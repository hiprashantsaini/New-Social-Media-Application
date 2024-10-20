const express = require('express');
const userController = require('../controllers/userController');
const auth=require('../authentication/auth');
// const session=require('express-session');

const router = express.Router();
// for signup
router.post('/signup',userController.signupUser);

// for loginUser with login form and update device information
router.post('/login',userController.loginUser);

router.get('/logout',userController.logout);


//authenticatication with token
router.get('/profile',auth.authenticateWithToken);


router.post('/follow',auth.isLogin,userController.followUser);

router.post('/unfollow',auth.isLogin,userController.unFollowUser);

router.post('/transferpoints',auth.isLogin,userController.transferPoints);

//Change language
router.post('/changelanguage',auth.isLogin,userController.changeLanguage);


module.exports = router;
