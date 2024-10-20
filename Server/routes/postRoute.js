const express = require('express');
const postController = require('../controllers/postController');
const postRoute = express.Router();
const auth = require('../authentication/auth');

postRoute.post('/createpost', auth.isLogin, postController.createPost);

postRoute.get('/getposts', auth.isLogin, postController.getAllPosts);
//delete post 
postRoute.delete('/deletepost/:postId', auth.isLogin, postController.deletePost);


postRoute.post('/addcomment/:postId', auth.isLogin, postController.addComment);
//delete comment
postRoute.post('/deletecomment/:postId', auth.isLogin, postController.deleteComment);
postRoute.get('/likepost/:postId', auth.isLogin, postController.likePost);

postRoute.get('/dislikepost/:postId',auth.isLogin,postController.disLikePost);
//Update title of the post
postRoute.post('/updatetitle/:postId',auth.isLogin,postController.updatePostTitle);
//Update description of the post
postRoute.post('/updatedescription/:postId',auth.isLogin,postController.updatePostDescription);

module.exports = postRoute;
