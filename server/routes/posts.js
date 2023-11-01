//handle all the routes regarding to posts
import express from "express";

import { getPostsBySearch,  getPosts , getPost ,createPost , updatePost , deletePost , likePost , commentPost } from '../controllers/posts.js';

const router = express.Router();
import auth from '../middleware/auth.js';




//** Remember we are inside our Posts.js and we are the route are staring with /posts even we can't see it
router.get('/search' , getPostsBySearch) //basically it is /posts/search , as we define inside our api--> index.js
router.get('/' , getPosts);
//for getting a single post
router.get('/:id' , getPost);

router.post('/' ,auth, createPost);
// router.get('/:id' , getPost);              //auth is the middleware that execute first and check and than proceed to NEXT
router.patch('/:id' ,auth, updatePost);
router.delete('/:id',auth, deletePost);
router.patch('/:id/likePost',auth, likePost);
//*comment
router.post('/:id/commentPost' ,auth, commentPost);

export default router;
