const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const otpGenerator = require('otp-generator');

const loginUser = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    console.log("email:", email)
    console.log("password:", password);

    if(!email || !password){
      return res.status(400).send({ status: false, message: "Something is missing!" });
    }

    let user = await User.findOne({ email: email }).populate('subscription.planId');
    if (!user) {
      //// 'status:false' means login is unsuccess and 'status:true' means login is success
      return res.status(200).send({ status: false, message: "Invalid email or password!" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(200).send({ status: false, message: "Invalid email or password!" });
    }

    const token = jwt.sign({ userId: user._id }, 'my_secret_key', { expiresIn: '1d' })
    res.cookie('token', token, { httpOnly: true, sameSite: none,maxAge: 1 * 24 * 60 * 60 * 1000 }).json({ status: true, message: "LoggedIn successfull" })

  } catch (error) {
    console.log("login:", error.message);
    res.status(500).send({ status: false, deviceOtp: false, message: "Internal server error..." });
  }
}

const signupUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name: name,
      email: email,
      phone: phone,
      password: hashPassword
    })

    const udata = await user.save();
    res.status(201).send({ message: "You are registered successfully!" });

  } catch (error) {
    console.log(error.message)
    res.status(500).send({ msg: "Internal server error.." });
  }
}
//OTP verification to verify correctness of mobile and email
const verifyOtp = async (req, res) => {
  try {
    const newOtp = req.body.emailOtp;
    const email = req.body.email;
    console.log("check:", newOtp, otps)
    if (newOtp == otps[email]) {
      console.log("check:", newOtp, otps[email])
      res.status(200).send({ verified: true, message: "Otp is Valid" });
    } else {
      console.log("verifyOtp: Otp is InValid");
      res.status(400).send({ verified: false, message: "Otp is InValid" });
    }
  } catch (error) {
    console.log("sendEmailOtp:", error.message);
    res.status(500).send({ message: "Internal server error" });
  }
}

// Send email Otp 
const sendEmailOtp = async (req, res) => {
  try {
    const email = req.body.email;
    const otp = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });
    otps[email] = otp;
    const data = await sendOtpMail(email, otp);
    res.status(200).send({ message: "Otp is sent on your email." });
  } catch (error) {
    console.log("sendEmailOtp:", error.message);
    res.status(500).send({ message: "Internal server error" });
  }
}



// follow user
const followUser = async (req, res) => {
  try {
    const { userId, followedId } = req.body;
    // userId ==follower of followedId
    const followedUser = await User.findById({ _id: followedId });
    const follower = await User.findById({ _id: userId });

    if (followedUser.followers.indexOf(userId) === -1 && follower.followed.indexOf(followedId) === -1) {
      follower.followed.push(followedId);
      await follower.save();

      followedUser.followers.push(userId);
      await followedUser.save();

      await User.findByIdAndUpdate({ _id: followedId }, { $inc: { points: 10 } });

      return res.status(200).send({ status: true, message: "You have followed" });
    }

    console.log("followUser");
    return res.status(200).send({ status: true, message: "You have followed" });
    // return res.status(400).send({ status: false, message: "Already  followed" });

  } catch (error) {
    console.log("followUser:", error.message);
    res.status(500).send({ status: false, message: "Internal server error..." });
  }
}

// unfollow user 
const unFollowUser = async (req, res) => {
  try {
    const { userId, followedId } = req.body;
    // userId ==follower of followedId
    const followedUser = await User.findById({ _id: followedId });
    const followedUserIndex = followedUser.followers.indexOf(userId);
    if (followedUserIndex !== -1) {
      followedUser.followers.splice(followedUserIndex, 1);
      await followedUser.save();
    }


    const follower = await User.findById({ _id: userId });
    const followerIndex = follower.followed.indexOf(followedId);
    if (followerIndex !== -1) {
      follower.followed.splice(followerIndex, 1);
      await follower.save();
    }

    await User.findByIdAndUpdate({ _id: followedId }, { $inc: { points: -10 } });


    console.log("UnfollowUser");
    return res.status(200).send({ status: true, message: "You have unfollowed" });

  } catch (error) {
    console.log("followUser:", error.message);
    res.status(500).send({ status: false, message: "Internal server error..." });
  }
}




const transferPoints = async (req, res) => {
  try {
    const fromUserId = req.userId;// LoggedIn user can transfer his points to any other user
    const toUserId = req.body.toUserId;
    const points = req.body.points;

    const transferer = await User.findById({ _id: fromUserId }, { points: 1, _id: 0 });
    console.log("Points:", points)
    console.log("transferer", transferer.points)
    if (points > transferer.points) {
      console.log("You have not sufficient points")
      return res.status(400).send({ status: false, message: "You have not sufficient points" });
    }

    await User.findByIdAndUpdate({ _id: fromUserId }, { $inc: { points: -points } });
    await User.findByIdAndUpdate({ _id: toUserId }, { $inc: { points: points } });
    console.log("Points has been transfered.")
    return res.status(200).send({ status: true, message: "Points has been transfered." });

  } catch (error) {
    console.log("transferPoints:", error.message);
    res.status(500).send({ status: false, message: "Internal server error..." });
  }
}

// Change language
const changeLanguage = async (req, res) => {
  try {
    const userId = req.userId;
    const language = req.body.language;
    console.log("changeLanguage:", req.body);
    await User.findByIdAndUpdate({ _id: userId }, { $set: { language: language } });
    res.status(200).send({ status: true, message: "Language is changed" });
  } catch (error) {
    console.log("changeLanguage:", error.message);
    res.status(500).send({ status: false, message: "Internal server error..." });
  }
}

const logout = async (req, res) => {
  try {
    res.cookie('token', '', { maxAge: 0 }).send({ success: true, message: "Logged out" });
  } catch (error) {
    console.log("logout:", error.message);
    res.status(500).send({ status: false, message: "Internal server error..." });
  }
}

module.exports = {
  loginUser,
  signupUser,
  sendEmailOtp,
  verifyOtp,
  followUser,
  unFollowUser,
  transferPoints,
  changeLanguage,
  logout
}