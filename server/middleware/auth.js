import jwt from 'jsonwebtoken';

// const secretKey = process.env.JWT_SECRET;

//What is middleware? For anykind of action that happens before Something
//Let's understand what should be something!

//Suppose user wants to like post , and he or she Click the like button but we can't give that permisson
//to anyone right! first we need to check and vrify that user so we Check the user using Auth middleware
//and if it is a valid user we give the permission so we use NEXT .

//Click the like button => auth middleware (NEXT) => like controller

//here the next play an important role , we say do this and after that do something next

const auth = async (req , res , next) => {
    try {
        //Confirming the user if , he or she is a real user or not (because we are going to give them a access to do CRUD operation)
        //How we do that? we can do that using jsonwebtoken 
        //jwt token that we generated for every single user those who signin or signup to our website


        //we need token and exactly the same thing we are doing here  
        //and this code splits the string to get the actual token part, which is at index 1 after splitting
        const token = req.headers.authorization.split(' ')[1];

        //There is two token ( googleOauth and Our own), So let's decide 

        const isCustomAuth = token.length < 500; //This is our Own

        let decodeData;

        if(token && isCustomAuth){  //finaly if we get the Token and it is our Own than,
            decodeData = jwt.verify(token , 'secret'); //we need to set the decoded data to jwt.verify that gives the data of each verify user
            req.userId = decodeData?.id; //Store his id in req.userId
        }else{

            //Working with the googleOauth
            decodeData = jwt.decode(token);
            req.userId = decodeData?.sub; // Stands for "subject." It typically holds the unique identifier for the user (provided by google)
        }

        //Hey look i am here
        next();   //My body stays here but someone else gonna use me ..(that fellow is route)
    } catch (error) {
        console.log(error)
    }
}

export default auth;