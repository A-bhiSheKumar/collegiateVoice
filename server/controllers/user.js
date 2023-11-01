//here is all the complex logic for signin and signup

import jwt from 'jsonwebtoken'; //for  stateless authentication (once user login we make them login for a long time as per need even they leave the page)
import bcrypt from 'bcrypt'; // just for making password save


// const secretKey = process.env.JWT_SECRET;

import User from '../models/user.js';


export const signin = async (req , res) => {
    //for sign in we need to things from our frontend that is email and password.
    //how we get the data? right! well, we can achive that by simply using req.body
    //whenever we have a post req we gonna have all the data from req.body
    const { email , password } = req.body;

    try {
        //if we signining in well that means the user is in our database. So let's find that fellow!

        //1. find the email first if email not match ...
        const existingUser = await User.findOne({email});
        //2. send the status code and message
        if(!existingUser) return res.status(404).json({message: "User doesn't exist."})

        //3. if email exists check for password
        const isPasswordCorrect = await bcrypt.compare(password , existingUser.password);
        //4. if password not mathes or incorrect
        if(!isPasswordCorrect) return res.status(400).json({message: "Invalid credentials"});//let me something intresting , Do you know why we not mention your password is invalid or wrong something like that because if we did that, than by any chance a hacker visit out website! i know this never gonna be happen but suppose something happen like that then he/she knows i craked the email the only thing i need to crack is password so , he/she start decoding the password...lol

        //Finaly if the user is in our database and password also matches than , we need to get his,
        //jwt(jsonWebToken) that we need to send to the frontend
        const token = jwt.sign({email: existingUser.email , id: existingUser._id} , 'secret' , {expiresIn:'1h'})

        //now simply return to the frontEnd..?/?
        res.status(200).json({result: existingUser , token})

    } catch (error) {
        res.status(500).json({message: 'Something went wrong.'})
    }
}


export const signup = async (req , res) => {
    const {firstName , lastName , email , password , confirmPassword} = req.body;

    try {
        //Let staring makin our new user (signUP)
        //1. first we need to check if user is already exist or not !
        const existingUser = await User.findOne({email});
        //if user exist than we need to send the mesage that bro user alreadt exist
        if(existingUser) return res.status(400).json({message: "User already exists"})

        //if not exists than we now procced the signup process
        if(password !== confirmPassword) return res.status(400).json({message: "Password doesnot match"})

        //hashing the password(here 12 is a salt means difficulity of the password level 12)
        const hashedPassword = await bcrypt.hash(password , 12);

        //Now we are creating a user...
        const result = await User.create({email , password: hashedPassword , name: `${firstName} ${lastName}`});

        //creating a token
        const token = jwt.sign({email: result.email , id: result._id} , 'secret' , {expiresIn:'1h'});

        //return the user
        res.status(200).json({result , token})

    } catch (error) {
        res.status(500).json({message: "Something went wrong"});
    }
}
  
