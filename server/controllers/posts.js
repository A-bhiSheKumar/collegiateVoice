//all the logic for routes
import mongoose from "mongoose";
import PostMessage from "../models/postMessage.js";



export const getPost = async (req , res) => {
  const {id} = req.params;
  try {
    const post = await PostMessage.findById(id);

    res.status(200).json(post);
  } catch (error) {
    res.status(404).json({message: error.message});
  }
}

export const getPosts = async (req, res) => {
  try {
    //Pagination works
    //* Distucting the page
    const { page } = req.query;
    //* Making limits of page that should be render at one page
    const LIMIT = 4;
    //* Than we need a start Index of a post on a specific page
    const startIndex = (Number(page) - 1) * LIMIT ; //* getting the starting index of every page
    //* We want to count up all the documents so , we know the how many documents we have
    //why we need to do taht?  Supoose we have a specific number of pages , so we need to know what's the last page that we need to scrool to
    const total = await PostMessage.countDocuments({});
    //* We are sorting the data with the newest to oldest (so we get a newest posts at first) than we have a limit(this is make sure that we only get a posts of limits that we define here is 8 )
    //* and finally skip that is responsible for skiping all the previous pages ( all the way to the stariting index)
    const posts = await PostMessage.find().sort({ _id: -1}).limit(LIMIT).skip(startIndex);

    res.status(200).json({data: posts , currentPage: Number(page) , numberOfPages: Math.ceil(total / LIMIT)} );
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

//** SEARCH */
export const getPostsBySearch = async (req, res) => {
  //* getting data from query
  const { searchQuery, tags } = req.query;
  try {
    const title = new RegExp(searchQuery, "i");

    //let fetch the post by title or id
    const posts = await PostMessage.find({
      $or: [{ title }, { tags: { $in: tags.split(",") } }],
    });
    //* find all the post that matches one of those criteria

    //finaly we have the data
    res.json({ data: posts });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createPost = async (req, res) => {
  const post = req.body;
  //edit this part ,,,,
  const newPostMessage = new PostMessage({
    ...post,
    creator: req.userId,
    createdAt: new Date().toISOString(),
  });
  try {
    await newPostMessage.save();

    res.status(201).json(newPostMessage);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updatePost = async (req, res) => {
  const { id: _id } = req.params;
  // const post = req.body;
  const { title, message, creator, selectedFile, tags } = req.body;

  //Checking that _id is really a mongoose id or not .
  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send("No post with that id found!");

  //if the id is valid ..
  // const updatedPost = await PostMessage.findByIdAndUpdate(_id , post, {new : true});
  const updatedPost = { creator, title, message, tags, selectedFile, _id: id };

  await PostMessage.findByIdAndUpdate(id, updatedPost, { new: true });

  res.json(updatedPost);
};

export const deletePost = async (req, res) => {
  const { id } = req.params;
  //Checking that _id is really a mongoose id or not .
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No post with that id found!");

  await PostMessage.findByIdAndRemove(id);

  // console.log('DELETE!')

  res.json({ message: "Post deleted successfully" });
};

//like
export const likePost = async (req, res) => {
  const { id } = req.params;

  //Implementing the only one like functinality
  //1. check the use is authenticated or not
  // if not
  if (!req.userId) return res.json({ message: "Unauthenticated" });

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No post with that id found!");

  //we need to find the post
  const post = await PostMessage.findById(id);

  //2.now we need to see if the user id is already in the action or is it not
  const index = post.likes.findIndex((id) => id === String(req.userId));

  //2.
  if (index === -1) {
    //it should be -1 only when his id is not in action(THIS MEAN HE WANT TO LIKE THE POST)
    post.likes.push(req.userId);
  } else {
    //we have the index so , he can remove his like
    post.likes = post.likes.filter((id) => id !== String(req.userId));
  }

  const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {
    new: true,
  });

  res.json(updatedPost);
};


//* Comment
export const commentPost = async (req , res) => {
  //* We need to get some values from the front-end ( value and id)

  const { id } = req.params;
  const { value } = req.body;


  //using the value to create a comment in //* DataBase
  //* 1.We are getting the post from the database
  const post = await PostMessage.findById(id);
  //* 2. Adding comments to that post
  post.comments.push(value);
  //* 3. Updating the database so the new post content that comment
  const updatedPost = await PostMessage.findByIdAndUpdate( id , post , {new: true});

//Return that to frontend
  res.json(updatedPost);
}





// export default router;
